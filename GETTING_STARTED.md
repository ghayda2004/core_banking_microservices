# 🚀 Getting Started with Core Banking - Microservices Platform

This guide will help you get started with the Core Banking microservices platform.

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **MongoDB** 7+ ([Download](https://www.mongodb.com/try/download/community))
- **Docker** (optional, for containerized deployment)

## Option 1: Docker Compose (Recommended) 🐳

Start all services with a single command:

```bash
docker-compose up -d
```

Access the applications:
- **API Gateway**: http://localhost:8080
- **Client App**: http://localhost:65124
- **Admin App**: http://localhost:4201

## Option 2: Manual Setup 🛠️

### 1. Start MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Windows - MongoDB installed as service
net start MongoDB

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 2. Seed the Database

```bash
cd backend/services/scripts
npm install
npm run seed
```

This creates test accounts:
- **Admin**: admin@banking.com / admin123
- **Client**: client@banking.com / client123

### 3. Start Microservices

**Linux/Mac:**
```bash
./start-services.sh
```

**Windows:**
```bash
start-services.bat
```

Or start services individually:
```bash
# Auth Service
cd backend/services/auth
npm install
cp .env.example .env
npm run dev

# Repeat for: accounts, transactions, clients, admin, notifications, api-gateway
```

### 4. Start Frontend Applications

**Client App:**
```bash
npm install --legacy-peer-deps
npm start
# Access at http://localhost:65124
```

**Admin App:**
```bash
cd admin
npm install --legacy-peer-deps
npm start
# Access at http://localhost:4201
```

## 🏗️ Microservices Architecture

```
Client/Admin Apps → API Gateway (8080) → Microservices (3001-3006) → MongoDB
```

### Services Overview:
1. **Auth Service** (3001) - User authentication & JWT tokens
2. **Accounts Service** (3002) - Account management & balances
3. **Transactions Service** (3003) - Money transfers & history
4. **Clients Service** (3004) - Client profiles & KYC
5. **Admin Service** (3005) - Admin operations aggregator
6. **Notifications Service** (3006) - Real-time notifications
7. **API Gateway** (8080) - Single entry point for all requests

For detailed architecture documentation, see [backend/services/README.md](backend/services/README.md)

## 🔍 Verify Installation

Check if all services are healthy:

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "healthy",
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

## 🔐 Default Test Credentials

**Admin User:**
- Email: `admin@banking.com`
- Password: `admin123`

**Client User:**
- Email: `client@banking.com`
- Password: `client123`
- Account Balance: 15,420.50 TND

## 🛑 Stopping Services

**Linux/Mac:**
```bash
./stop-services.sh
```

**Windows:**
- Close the command prompt windows running the services

**Docker:**
```bash
docker-compose down
```

## Project Features

✅ **Dashboard** - View account balance, IBAN, and recent transactions
✅ **Transaction History** - Browse all transactions with filters
✅ **Money Transfer** - Send money with form validation
✅ **Modern UI** - Fintech design with Tailwind CSS
✅ **Responsive** - Works on mobile, tablet, and desktop
✅ **Icons** - Lucide Angular icons
✅ **Charts** - Chart.js for transaction visualization

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          Dashboard component
│   │   ├── sidebar/            Navigation sidebar
│   │   ├── transaction-list/   Transaction table
│   │   └── transfer/           Transfer form
│   ├── services/
│   │   └── account.service.ts  API service
│   ├── app.component.ts        Main component
│   └── app.routes.ts           Route configuration
├── environments/
│   ├── environment.ts          Dev environment
│   └── environment.prod.ts     Production environment
├── styles.css                  Global styles
├── main.ts                     Application bootstrap
└── index.html                  HTML template
```

## Configuration

### API Endpoint
Update `src/app/services/account.service.ts`:
```typescript
private apiUrl = 'http://localhost:8080/api/accounts';
```

### Tailwind Colors
Customize colors in `tailwind.config.js`:
```javascript
colors: {
  'navy': '#0F1419',
  'navy-light': '#1a1f2e',
  'navy-lighter': '#252d3d',
}
```

## Demo Data

The application includes demo data that displays automatically when the API is unavailable. This allows you to test the UI without a backend.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚠️ Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Or start with Docker: `docker run -d -p 27017:27017 mongo:7`

### "Port already in use"
- Check what's using the port: `lsof -i :8080` (Linux/Mac) or `netstat -ano | findstr :8080` (Windows)
- Stop the conflicting process or change the port in service's `.env` file

### "Services not starting"
- Check logs in `./logs/` directory
- Ensure all dependencies are installed: `npm install` in each service
- Verify MongoDB is accessible

### "Module not found" errors
```bash
npm install --legacy-peer-deps
```

### Build errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 💡 Development Tips

- View Docker logs: `docker-compose logs -f`
- View service logs: `tail -f logs/[service-name].log`
- Rebuild services: `docker-compose up --build`
- Reset database: Re-run `npm run seed` in scripts folder
- API documentation: Each service has a README with endpoint details

## 🎯 Next Steps

1. Login to the client app at http://localhost:65124
2. Use credentials: client@banking.com / client123
3. View your account balance and transactions
4. Try making a transfer
5. Login to admin app at http://localhost:4201
6. Use admin credentials: admin@banking.com / admin123
7. View and manage all accounts, clients, and transactions

## 📚 Additional Documentation

- [Complete Microservices Documentation](backend/services/README.md)
- [Architecture Overview](ARCHITECTURE.md)
- [API Integration Guide](API_INTEGRATION.md)
- [Project Summary](PROJECT_SUMMARY.md)

## 📞 Need Help?

- Check the [main README](README.md)
- Review [backend services documentation](backend/services/README.md)
- Each microservice has its own README with detailed API docs
- Create an issue on GitHub

---

**Happy Banking! 🏦**
