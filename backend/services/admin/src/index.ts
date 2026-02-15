import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'admin',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║             ADMIN MICROSERVICE - RUNNING                   ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Endpoint: http://localhost:${PORT}/api/admin
🔍 Health Check: http://localhost:${PORT}/health

Available Routes (Proxied):
- GET  /api/admin/accounts - Get all accounts
- PATCH /api/admin/accounts/:id/status - Update account status
- GET  /api/admin/clients - Get all clients
- PATCH /api/admin/clients/:id/status - Update client status
- GET  /api/admin/transactions - Get all transactions
- GET  /api/admin/transactions/pending - Get pending transactions
- POST /api/admin/transactions/:id/validate - Validate transaction
- POST /api/admin/transactions/:id/reject - Reject transaction
  `);
});

export default app;
