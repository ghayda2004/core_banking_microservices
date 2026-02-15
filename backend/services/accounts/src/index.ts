import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import accountsRoutes from './routes/accounts.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_banking_accounts';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/accounts', accountsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'accounts',
    timestamp: new Date()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Accounts Service)');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║            ACCOUNTS MICROSERVICE - RUNNING                 ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/accounts
🔍 Health Check: http://localhost:${PORT}/health

Available Routes:
- GET  /api/accounts/info - Get account info
- POST /api/accounts/create - Create new account
- PATCH /api/accounts/:id/balance - Update balance
- GET  /api/accounts/all - Get all accounts (admin)
- PATCH /api/accounts/:id/status - Update status (admin)
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;
