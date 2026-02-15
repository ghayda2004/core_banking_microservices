import express, { Response } from 'express';
import Account from '../models/Account';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get account info for authenticated user
router.get('/info', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const account = await Account.findOne({ userId: req.user!.userId });
    
    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    res.json(account);
  } catch (error) {
    console.error('Get account info error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du compte' });
  }
});

// Create new account (for admin or during registration)
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { accountNumber, iban, balance = 0, accountHolder, accountType = 'Compte Courant' } = req.body;

    // Use authenticated user's ID or provided userId (for admin)
    const userId = req.body.userId || req.user!.userId;

    const account = new Account({
      accountNumber,
      iban,
      userId,
      balance,
      accountHolder,
      accountType,
      currency: 'TND',
      status: 'active'
    });

    await account.save();

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      account
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

// Update account balance (internal use)
router.patch('/:accountId/balance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { amount, operation } = req.body; // operation: 'add' or 'subtract'

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    if (operation === 'add') {
      account.balance += amount;
    } else if (operation === 'subtract') {
      if (account.balance < amount) {
        return res.status(400).json({ error: 'Solde insuffisant' });
      }
      account.balance -= amount;
    }

    await account.save();

    res.json({
      success: true,
      message: 'Solde mis à jour',
      balance: account.balance
    });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du solde' });
  }
});

// Get all accounts (admin only)
router.get('/all', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    console.error('Get all accounts error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
  }
});

// Update account status (admin only)
router.patch('/:accountId/status', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { status } = req.body;

    const account = await Account.findByIdAndUpdate(
      accountId,
      { status },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    res.json({
      success: true,
      message: `Compte ${status}`,
      account
    });
  } catch (error) {
    console.error('Update account status error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

export default router;
