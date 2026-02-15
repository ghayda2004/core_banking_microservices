import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import transactionsRoutes from './routes/transactions.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_banking_transactions';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'transactions',
    timestamp: new Date()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Transactions Service)');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║          TRANSACTIONS MICROSERVICE - RUNNING               ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/transactions
🔍 Health Check: http://localhost:${PORT}/health

Available Routes:
- GET  /api/transactions - Get user transactions
- POST /api/transactions/transfer - Create transfer
- GET  /api/transactions/all - Get all (admin)
- GET  /api/transactions/pending - Get pending (admin)
- POST /api/transactions/:id/validate - Validate (admin)
- POST /api/transactions/:id/reject - Reject (admin)
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;
