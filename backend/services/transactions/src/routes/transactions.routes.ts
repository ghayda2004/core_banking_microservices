import express, { Response } from 'express';
import axios from 'axios';
import Transaction from '../models/Transaction';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();
const ACCOUNTS_SERVICE_URL = process.env.ACCOUNTS_SERVICE_URL || 'http://localhost:3002';
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3006';

// Get transactions for authenticated user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Get user's account from accounts service
    const accountResponse = await axios.get(`${ACCOUNTS_SERVICE_URL}/api/accounts/info`, {
      headers: { Authorization: req.headers.authorization }
    });

    const account = accountResponse.data;
    
    const transactions = await Transaction.find({ fromAccountId: account._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions' });
  }
});

// Create transfer
router.post('/transfer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { toIban, recipientName, amount, description, transactionDate } = req.body;

    // Get user's account
    const accountResponse = await axios.get(`${ACCOUNTS_SERVICE_URL}/api/accounts/info`, {
      headers: { Authorization: req.headers.authorization }
    });

    const account = accountResponse.data;

    // Check balance
    if (account.balance < amount) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    // Create transaction
    const transaction = new Transaction({
      fromAccountId: account._id,
      toIban,
      toRecipient: recipientName,
      amount,
      currency: 'TND',
      type: 'debit',
      status: 'completed',
      description,
      createdAt: transactionDate ? new Date(transactionDate) : new Date()
    });

    await transaction.save();

    // Update account balance
    await axios.patch(
      `${ACCOUNTS_SERVICE_URL}/api/accounts/${account._id}/balance`,
      { amount, operation: 'subtract' },
      { headers: { Authorization: req.headers.authorization } }
    );

    // Send notification (fire and forget)
    try {
      await axios.post(`${NOTIFICATIONS_SERVICE_URL}/api/notifications/send`, {
        userId: req.user!.userId,
        type: 'transaction',
        title: 'Virement effectué',
        message: `Virement de ${amount} TND vers ${recipientName}`,
        metadata: { transactionId: transaction._id }
      });
    } catch (notifError) {
      console.error('Notification error:', notifError);
      // Don't fail the transaction if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Virement effectué avec succès',
      transactionId: transaction._id,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Erreur lors du virement' });
  }
});

// Get all transactions (admin)
router.get('/all', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions' });
  }
});

// Get pending transactions (admin)
router.get('/pending', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions en attente' });
  }
});

// Validate transaction (admin)
router.post('/:id/validate', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    transaction.status = 'completed';
    transaction.validatedBy = req.user!.userId;
    transaction.validatedAt = new Date();

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction validée',
      transaction
    });
  } catch (error) {
    console.error('Validate transaction error:', error);
    res.status(500).json({ error: 'Erreur lors de la validation' });
  }
});

// Reject transaction (admin)
router.post('/:id/reject', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    transaction.status = 'failed';
    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction rejetée',
      transaction
    });
  } catch (error) {
    console.error('Reject transaction error:', error);
    res.status(500).json({ error: 'Erreur lors du rejet' });
  }
});

export default router;
