import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import clientsRoutes from './routes/clients.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_banking_clients';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'clients',
    timestamp: new Date()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Clients Service)');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║            CLIENTS MICROSERVICE - RUNNING                  ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/clients
🔍 Health Check: http://localhost:${PORT}/health

Available Routes:
- GET  /api/clients/me - Get client info
- POST /api/clients/create - Create client profile
- PATCH /api/clients/me - Update profile
- GET  /api/clients/all - Get all clients (admin)
- PATCH /api/clients/:id/status - Update status (admin)
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;
