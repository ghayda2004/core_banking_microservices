import express, { Response } from 'express';
import Client from '../models/Client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get client info for authenticated user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ userId: req.user!.userId });
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client info error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// Create client profile
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country = 'Tunisia',
      documentType,
      documentNumber
    } = req.body;

    // Use authenticated user's ID or provided userId (for admin)
    const userId = req.body.userId || req.user!.userId;

    // Check if client already exists
    const existingClient = await Client.findOne({ userId });
    if (existingClient) {
      return res.status(400).json({ error: 'Client existe déjà' });
    }

    const client = new Client({
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      documentType,
      documentNumber,
      status: 'active'
    });

    await client.save();

    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
});

// Update client profile
router.patch('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    
    // Don't allow updating userId or status via this endpoint
    delete updates.userId;
    delete updates.status;

    const client = await Client.findOneAndUpdate(
      { userId: req.user!.userId },
      updates,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour',
      client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Get all clients (admin only)
router.get('/all', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// Update client status (admin only)
router.patch('/:clientId/status', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const { status } = req.body;

    const client = await Client.findByIdAndUpdate(
      clientId,
      { status },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    res.json({
      success: true,
      message: `Client ${status}`,
      client
    });
  } catch (error) {
    console.error('Update client status error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

export default router;
