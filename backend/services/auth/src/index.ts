import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_banking_auth';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'auth',
    timestamp: new Date()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Auth Service)');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║              AUTH MICROSERVICE - RUNNING                   ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/auth
🔍 Health Check: http://localhost:${PORT}/health

Available Routes:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/verify - Verify token
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;
