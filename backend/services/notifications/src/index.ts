import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import notificationsRoutes from './routes/notifications.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_banking_notifications';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notifications',
    timestamp: new Date()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Notifications Service)');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║        NOTIFICATIONS MICROSERVICE - RUNNING                ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/notifications
🔍 Health Check: http://localhost:${PORT}/health

Available Routes:
- GET  /api/notifications - Get user notifications
- POST /api/notifications/send - Send notification
- PATCH /api/notifications/:id/read - Mark as read
- PATCH /api/notifications/read-all - Mark all as read
- GET  /api/notifications/unread-count - Get unread count
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;
