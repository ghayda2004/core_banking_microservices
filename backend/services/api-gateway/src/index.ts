import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const ACCOUNTS_SERVICE = process.env.ACCOUNTS_SERVICE_URL || 'http://localhost:3002';
const TRANSACTIONS_SERVICE = process.env.TRANSACTIONS_SERVICE_URL || 'http://localhost:3003';
const CLIENTS_SERVICE = process.env.CLIENTS_SERVICE_URL || 'http://localhost:3004';
const ADMIN_SERVICE = process.env.ADMIN_SERVICE_URL || 'http://localhost:3005';
const NOTIFICATIONS_SERVICE = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3006';

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  },
  onError: (err, req, res) => {
    console.error('Auth Service Error:', err.message);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

// Accounts Service Proxy
app.use('/api/accounts', createProxyMiddleware({
  target: ACCOUNTS_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/accounts': '/api/accounts'
  },
  onError: (err, req, res) => {
    console.error('Accounts Service Error:', err.message);
    res.status(503).json({ error: 'Accounts service unavailable' });
  }
}));

// Transactions Service Proxy
app.use('/api/transactions', createProxyMiddleware({
  target: TRANSACTIONS_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/transactions': '/api/transactions'
  },
  onError: (err, req, res) => {
    console.error('Transactions Service Error:', err.message);
    res.status(503).json({ error: 'Transactions service unavailable' });
  }
}));

// Clients Service Proxy
app.use('/api/clients', createProxyMiddleware({
  target: CLIENTS_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/clients': '/api/clients'
  },
  onError: (err, req, res) => {
    console.error('Clients Service Error:', err.message);
    res.status(503).json({ error: 'Clients service unavailable' });
  }
}));

// Admin Service Proxy
app.use('/api/admin', createProxyMiddleware({
  target: ADMIN_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/admin': '/api/admin'
  },
  onError: (err, req, res) => {
    console.error('Admin Service Error:', err.message);
    res.status(503).json({ error: 'Admin service unavailable' });
  }
}));

// Notifications Service Proxy
app.use('/api/notifications', createProxyMiddleware({
  target: NOTIFICATIONS_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api/notifications'
  },
  onError: (err, req, res) => {
    console.error('Notifications Service Error:', err.message);
    res.status(503).json({ error: 'Notifications service unavailable' });
  }
}));

// Health check endpoint - aggregates all services
app.get('/api/health', async (req: Request, res: Response) => {
  const services = {
    auth: { url: AUTH_SERVICE, status: 'unknown' },
    accounts: { url: ACCOUNTS_SERVICE, status: 'unknown' },
    transactions: { url: TRANSACTIONS_SERVICE, status: 'unknown' },
    clients: { url: CLIENTS_SERVICE, status: 'unknown' },
    admin: { url: ADMIN_SERVICE, status: 'unknown' },
    notifications: { url: NOTIFICATIONS_SERVICE, status: 'unknown' }
  };

  // Check each service
  for (const [name, service] of Object.entries(services)) {
    try {
      await axios.get(`${service.url}/health`, { timeout: 2000 });
      service.status = 'healthy';
    } catch (error) {
      service.status = 'unhealthy';
    }
  }

  const allHealthy = Object.values(services).every(s => s.status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    gateway: 'healthy',
    services: Object.fromEntries(
      Object.entries(services).map(([name, service]) => [name, service.status])
    ),
    timestamp: new Date()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Core Banking API Gateway',
    version: '1.0.0',
    services: [
      'auth',
      'accounts',
      'transactions',
      'clients',
      'admin',
      'notifications'
    ],
    endpoints: {
      auth: '/api/auth/*',
      accounts: '/api/accounts/*',
      transactions: '/api/transactions/*',
      clients: '/api/clients/*',
      admin: '/api/admin/*',
      notifications: '/api/notifications/*',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              API GATEWAY - CORE BANKING                    ║
║                     v1.0.0 (TND)                          ║
╚════════════════════════════════════════════════════════════╝

✅ Gateway running on http://localhost:${PORT}
📚 Health Check: http://localhost:${PORT}/api/health

🔀 Routing to Services:
   → Auth:          ${AUTH_SERVICE}
   → Accounts:      ${ACCOUNTS_SERVICE}
   → Transactions:  ${TRANSACTIONS_SERVICE}
   → Clients:       ${CLIENTS_SERVICE}
   → Admin:         ${ADMIN_SERVICE}
   → Notifications: ${NOTIFICATIONS_SERVICE}

Currency: Tunisian Dinar (TND)
  `);
});

export default app;
