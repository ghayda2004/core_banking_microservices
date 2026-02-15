"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const database = {
    users: [],
    accounts: [],
    transactions: [],
    clients: []
};
// Seed initial data
const seedData = () => {
    // Admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    database.users.push({
        id: (0, uuid_1.v4)(),
        email: 'admin@banking.com',
        password: adminPassword,
        name: 'Admin Banker',
        role: 'admin',
        createdAt: new Date()
    });
    // Client user
    const clientPassword = bcrypt.hashSync('client123', 10);
    const clientUser = {
        id: (0, uuid_1.v4)(),
        email: 'client@banking.com',
        password: clientPassword,
        name: 'Jean Dupont',
        role: 'client',
        createdAt: new Date()
    };
    database.users.push(clientUser);
    // Client account
    database.accounts.push({
        id: (0, uuid_1.v4)(),
        accountNumber: '123456789',
        iban: 'TN5910006035183885671999',
        userId: clientUser.id,
        balance: 15420.50,
        currency: 'TND',
        accountType: 'Compte Courant',
        accountHolder: 'Jean Dupont',
        status: 'active',
        createdAt: new Date()
    });
    // Sample client
    database.clients.push({
        id: clientUser.id,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'client@banking.com',
        phone: '+216 92 123 456',
        address: '123 Rue de Tunis',
        city: 'Tunis',
        country: 'Tunisia',
        documentType: 'CIN',
        documentNumber: '12345678',
        status: 'active',
        createdAt: new Date()
    });
    // Sample transactions
    database.transactions.push({
        id: (0, uuid_1.v4)(),
        fromAccountId: database.accounts[0].id,
        amount: 2500,
        currency: 'TND',
        type: 'credit',
        status: 'completed',
        description: 'Virement reçu - Employeur',
        toRecipient: 'Acme Corp',
        createdAt: new Date('2025-02-14')
    });
    database.transactions.push({
        id: (0, uuid_1.v4)(),
        fromAccountId: database.accounts[0].id,
        amount: 1200,
        currency: 'TND',
        type: 'debit',
        status: 'completed',
        description: 'Paiement loyer',
        toRecipient: 'Jean Landlord',
        createdAt: new Date('2025-02-13')
    });
    console.log('✅ Database seeded with initial data');
};
seedData();
const generateToken = (user) => {
    return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
};
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ error: 'Token invalide' });
    }
    req.user = payload;
    next();
};
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'banker') {
        return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
};
// ============ AUTHENTICATION ROUTES ============
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = database.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = generateToken(user);
    res.json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
});
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (database.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: (0, uuid_1.v4)(),
        email,
        password: hashedPassword,
        name,
        role: 'client',
        createdAt: new Date()
    };
    database.users.push(newUser);
    const token = generateToken(newUser);
    res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
});
// ============ ACCOUNT SERVICE ============
app.get('/api/accounts/info', authMiddleware, (req, res) => {
    const account = database.accounts.find(a => a.userId === req.user.userId);
    if (!account) {
        return res.status(404).json({ error: 'Compte non trouvé' });
    }
    res.json(account);
});
app.get('/api/accounts/transactions', authMiddleware, (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const account = database.accounts.find(a => a.userId === req.user.userId);
    if (!account) {
        return res.status(404).json({ error: 'Compte non trouvé' });
    }
    const transactions = database.transactions
        .filter(t => t.fromAccountId === account.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    res.json(transactions);
});
app.post('/api/accounts/transfer', authMiddleware, (req, res) => {
    const { fromAccount, toIban, recipientName, amount, description, transactionDate } = req.body;
    const account = database.accounts.find(a => a.userId === req.user.userId);
    if (!account) {
        return res.status(404).json({ error: 'Compte non trouvé' });
    }
    if (account.balance < amount) {
        return res.status(400).json({ error: 'Solde insuffisant' });
    }
    // Deduct from account
    account.balance -= amount;
    // Create transaction
    const transaction = {
        id: (0, uuid_1.v4)(),
        fromAccountId: account.id,
        toIban,
        toRecipient: recipientName,
        amount,
        currency: 'TND',
        type: 'debit',
        status: 'completed',
        description,
        createdAt: new Date(transactionDate)
    };
    database.transactions.push(transaction);
    res.status(201).json({
        success: true,
        message: 'Virement effectué avec succès',
        transactionId: transaction.id,
        timestamp: new Date()
    });
});
// ============ ADMIN ROUTES ============
// Get all accounts
app.get('/api/admin/accounts', authMiddleware, adminMiddleware, (req, res) => {
    res.json(database.accounts);
});
// Get all clients
app.get('/api/admin/clients', authMiddleware, adminMiddleware, (req, res) => {
    res.json(database.clients);
});
// Get all transactions
app.get('/api/admin/transactions', authMiddleware, adminMiddleware, (req, res) => {
    res.json(database.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});
// Get pending transactions for validation
app.get('/api/admin/transactions/pending', authMiddleware, adminMiddleware, (req, res) => {
    const pending = database.transactions.filter(t => t.status === 'pending');
    res.json(pending);
});
// Validate transaction
app.post('/api/admin/transactions/:id/validate', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const transaction = database.transactions.find(t => t.id === id);
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction non trouvée' });
    }
    transaction.status = 'completed';
    transaction.validatedBy = req.user.userId;
    transaction.validatedAt = new Date();
    res.json({ success: true, message: 'Transaction validée', transaction });
});
// Reject transaction
app.post('/api/admin/transactions/:id/reject', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const transaction = database.transactions.find(t => t.id === id);
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction non trouvée' });
    }
    transaction.status = 'failed';
    res.json({ success: true, message: 'Transaction rejetée', transaction });
});
// Block/Unblock account
app.patch('/api/admin/accounts/:id/status', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const account = database.accounts.find(a => a.id === id);
    if (!account) {
        return res.status(404).json({ error: 'Compte non trouvé' });
    }
    account.status = status;
    res.json({ success: true, message: `Compte ${status}`, account });
});
// Block/Unblock client
app.patch('/api/admin/clients/:id/status', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const client = database.clients.find(c => c.id === id);
    if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
    }
    client.status = status;
    res.json({ success: true, message: `Client ${status}`, client });
});
// ============ MICROSERVICE HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        services: {
            accounts: 'running',
            transactions: 'running',
            clients: 'running',
            auth: 'running'
        },
        timestamp: new Date()
    });
});
// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                  CORE BANKING API SERVER                   ║
║                      v1.0.0 (TND)                          ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📚 API Documentation at http://localhost:${PORT}/api/health

Default Credentials:
- Admin: admin@banking.com / admin123
- Client: client@banking.com / client123

Currency: Tunisian Dinar (TND)
Database: In-Memory (will reset on restart)
  `);
});
exports.default = app;
