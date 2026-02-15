import express, { Response, Request } from 'express';
import Notification from '../models/Notification';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Get notifications for authenticated user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const unreadOnly = req.query.unreadOnly === 'true';

    const query: any = { userId: req.user!.userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Send notification (internal - no auth required for inter-service communication)
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, metadata } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      metadata,
      read: false
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification envoyée',
      notification
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification' });
  }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Mark all notifications as read
router.patch('/read-all', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user!.userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user!.userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Erreur lors du comptage' });
  }
});

export default router;
