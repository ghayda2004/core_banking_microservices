# Core Banking Microservices Architecture

A complete microservices-based banking platform built with Node.js, TypeScript, Express, MongoDB, and Angular.

## 🏗️ Architecture Overview

The system is divided into 7 independent microservices:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORE BANKING PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐          ┌─────────────────┐             │
│  │  CLIENT APP     │          │  ADMIN APP      │             │
│  │  (Angular 17)   │          │  (Angular 17)   │             │
│  │  :65124         │          │  :4201          │             │
│  └────────┬────────┘          └────────┬────────┘             │
│           │                            │                      │
│           └──────────────┬─────────────┘                       │
│                          │                                     │
│              ┌───────────▼──────────────┐                      │
│              │   API GATEWAY :8080      │                      │
│              └───────────┬──────────────┘                      │
│                          │                                     │
│        ┌─────────────────┼─────────────────────┐               │
│        │                 │                     │               │
│    ┌───▼────┐  ┌─────────▼──────┐  ┌──────────▼────┐         │
│    │ AUTH   │  │  ACCOUNTS       │  │ TRANSACTIONS  │         │
│    │ :3001  │  │  :3002          │  │ :3003         │         │
│    └────────┘  └─────────────────┘  └───────────────┘         │
│                                                                 │
│    ┌────────┐  ┌─────────────────┐  ┌───────────────┐         │
│    │CLIENTS │  │  ADMIN          │  │ NOTIFICATIONS │         │
│    │ :3004  │  │  :3005          │  │ :3006         │         │
│    └────────┘  └─────────────────┘  └───────────────┘         │
│                                                                 │
│              ┌──────────────────────────────┐                   │
│              │   MongoDB Database :27017    │                   │
│              └──────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Microservices

### 1. **Auth Service** (Port 3001)
- User registration and authentication
- JWT token generation and verification
- Password hashing with bcrypt
- Role-based access control (client, admin, banker)

**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### 2. **Accounts Service** (Port 3002)
- Account creation and management
- Balance operations
- Account status management (active, inactive, blocked)

**Endpoints:**
- `GET /api/accounts/info` - Get account info
- `POST /api/accounts/create` - Create new account
- `PATCH /api/accounts/:id/balance` - Update balance
- `GET /api/accounts/all` - Get all accounts (admin)
- `PATCH /api/accounts/:id/status` - Update status (admin)

### 3. **Transactions Service** (Port 3003)
- Transaction creation and history
- Money transfers
- Transaction validation/rejection (admin)

**Endpoints:**
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/transfer` - Create transfer
- `GET /api/transactions/all` - Get all (admin)
- `GET /api/transactions/pending` - Get pending (admin)
- `POST /api/transactions/:id/validate` - Validate (admin)
- `POST /api/transactions/:id/reject` - Reject (admin)

### 4. **Clients Service** (Port 3004)
- Client profile management
- KYC information
- Client status management

**Endpoints:**
- `GET /api/clients/me` - Get client profile
- `POST /api/clients/create` - Create client profile
- `PATCH /api/clients/me` - Update profile
- `GET /api/clients/all` - Get all clients (admin)
- `PATCH /api/clients/:id/status` - Update status (admin)

### 5. **Admin Service** (Port 3005)
- Aggregation layer for admin operations
- Proxies requests to other services
- Centralized admin endpoint

**Endpoints:**
- All admin endpoints from accounts, transactions, and clients services

### 6. **Notifications Service** (Port 3006)
- Real-time notifications
- Transaction alerts
- System notifications

**Endpoints:**
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/send` - Send notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

### 7. **API Gateway** (Port 8080)
- Single entry point for all services
- Request routing
- Health check aggregation
- CORS handling

**Main Endpoint:**
- `GET /api/health` - Aggregated health check

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 7+
- npm or yarn
- Docker & Docker Compose (optional)

### Installation

#### Option 1: Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Option 2: Manual Installation

1. **Install MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
```

2. **Install and Start Each Service**

For each service (auth, accounts, transactions, clients, admin, notifications, api-gateway):

```bash
cd backend/services/[service-name]
npm install
cp .env.example .env
# Edit .env with your configuration
npm run build
npm start
# or for development:
npm run dev
```

3. **Start API Gateway**
```bash
cd backend/services/api-gateway
npm install
cp .env.example .env
npm run build
npm start
```

4. **Start Frontend Applications**

Client App:
```bash
npm install --legacy-peer-deps
npm start
# Access at http://localhost:65124
```

Admin App:
```bash
cd admin
npm install --legacy-peer-deps
npm start
# Access at http://localhost:4201
```

## 🔧 Configuration

### Environment Variables

Each service has its own `.env` file. Copy from `.env.example`:

**Auth Service:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/core_banking_auth
JWT_SECRET=your-secret-key-change-in-production
```

**Accounts Service:**
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/core_banking_accounts
AUTH_SERVICE_URL=http://localhost:3001
```

**Transactions Service:**
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/core_banking_transactions
AUTH_SERVICE_URL=http://localhost:3001
ACCOUNTS_SERVICE_URL=http://localhost:3002
NOTIFICATIONS_SERVICE_URL=http://localhost:3006
```

**API Gateway:**
```env
PORT=8080
AUTH_SERVICE_URL=http://localhost:3001
ACCOUNTS_SERVICE_URL=http://localhost:3002
TRANSACTIONS_SERVICE_URL=http://localhost:3003
CLIENTS_SERVICE_URL=http://localhost:3004
ADMIN_SERVICE_URL=http://localhost:3005
NOTIFICATIONS_SERVICE_URL=http://localhost:3006
```

## 📡 API Documentation

### Authentication Flow

1. Register or login through `/api/auth/login`
2. Receive JWT token
3. Include token in subsequent requests: `Authorization: Bearer <token>`

### Example API Calls

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@banking.com","password":"client123"}'
```

**Get Account Info:**
```bash
curl http://localhost:8080/api/accounts/info \
  -H "Authorization: Bearer <your-token>"
```

**Transfer Money:**
```bash
curl -X POST http://localhost:8080/api/transactions/transfer \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "toIban": "TN5910006035183885671999",
    "recipientName": "John Doe",
    "amount": 100,
    "description": "Payment",
    "transactionDate": "2025-02-15"
  }'
```

## 🧪 Testing

### Health Check

Check if all services are running:
```bash
curl http://localhost:8080/api/health
```

Response:
```json
{
  "status": "healthy",
  "gateway": "healthy",
  "services": {
    "auth": "healthy",
    "accounts": "healthy",
    "transactions": "healthy",
    "clients": "healthy",
    "admin": "healthy",
    "notifications": "healthy"
  }
}
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Service-to-service authentication
- CORS enabled on API Gateway
- MongoDB connection security

## 🛠️ Development

### Project Structure

```
backend/services/
├── auth/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── accounts/
├── transactions/
├── clients/
├── admin/
├── notifications/
└── api-gateway/
```

### Adding a New Service

1. Create service directory: `backend/services/[service-name]`
2. Add `package.json`, `tsconfig.json`, `.env.example`
3. Implement service in `src/`
4. Add Dockerfile
5. Update docker-compose.yml
6. Update API Gateway routing

## 📊 Monitoring

- Each service has a `/health` endpoint
- API Gateway aggregates health status
- Logs are centralized in Docker Compose
- MongoDB monitoring via standard tools

## 🔄 Deployment

### Production Checklist

- [ ] Update JWT_SECRET in all services
- [ ] Configure production MongoDB
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure backups
- [ ] Review CORS settings

## 📝 License

MIT License

## 👥 Contributors

- Core Banking Team

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Currency:** Tunisian Dinar (TND)  
**Version:** 1.0.0  
**Last Updated:** 2025-02-15
