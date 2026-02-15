import express, { Response, Request } from 'express';
import axios from 'axios';

const router = express.Router();

const ACCOUNTS_SERVICE_URL = process.env.ACCOUNTS_SERVICE_URL || 'http://localhost:3002';
const TRANSACTIONS_SERVICE_URL = process.env.TRANSACTIONS_SERVICE_URL || 'http://localhost:3003';
const CLIENTS_SERVICE_URL = process.env.CLIENTS_SERVICE_URL || 'http://localhost:3004';

// Proxy middleware for admin routes
const proxyRequest = async (serviceUrl: string, path: string, method: string, req: Request, res: Response) => {
  try {
    const config: any = {
      method,
      url: `${serviceUrl}${path}`,
      headers: {
        Authorization: req.headers.authorization
      }
    };

    if (method !== 'GET') {
      config.data = req.body;
    }

    const response = await axios(config);
    res.json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: 'Service unavailable' }
    );
  }
};

// Accounts routes
router.get('/accounts', (req, res) => proxyRequest(ACCOUNTS_SERVICE_URL, '/api/accounts/all', 'GET', req, res));
router.patch('/accounts/:id/status', (req, res) => proxyRequest(ACCOUNTS_SERVICE_URL, `/api/accounts/${req.params.id}/status`, 'PATCH', req, res));

// Clients routes
router.get('/clients', (req, res) => proxyRequest(CLIENTS_SERVICE_URL, '/api/clients/all', 'GET', req, res));
router.patch('/clients/:id/status', (req, res) => proxyRequest(CLIENTS_SERVICE_URL, `/api/clients/${req.params.id}/status`, 'PATCH', req, res));

// Transactions routes
router.get('/transactions', (req, res) => proxyRequest(TRANSACTIONS_SERVICE_URL, '/api/transactions/all', 'GET', req, res));
router.get('/transactions/pending', (req, res) => proxyRequest(TRANSACTIONS_SERVICE_URL, '/api/transactions/pending', 'GET', req, res));
router.post('/transactions/:id/validate', (req, res) => proxyRequest(TRANSACTIONS_SERVICE_URL, `/api/transactions/${req.params.id}/validate`, 'POST', req, res));
router.post('/transactions/:id/reject', (req, res) => proxyRequest(TRANSACTIONS_SERVICE_URL, `/api/transactions/${req.params.id}/reject`, 'POST', req, res));

export default router;
