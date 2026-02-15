# Quick Start Guide - Organization & User Service

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

## Installation

1. **Navigate to the service directory**:
   ```bash
   cd "Services/Organization & User Service"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   # Edit .env if you need to customize settings
   ```

## Running the Service

### Development Mode

Run with auto-reload (ts-node):
```bash
npm run dev
```

The service will start on `http://localhost:8081`

### Production Mode

1. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## Verify Installation

Once the service is running, you should see:

```
╔════════════════════════════════════════════════════════════╗
║         ORGANIZATION & USER SERVICE                        ║
║                  v1.0.0                                    ║
╚════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:8081
📚 Health Check: http://localhost:8081/api/organization/health
📊 Metrics: http://localhost:8081/api/organization/metrics
```

### Test the Health Endpoint

```bash
curl http://localhost:8081/api/organization/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Organization & User Service",
  "version": "1.0.0",
  "timestamp": "2026-02-15T...",
  "database": "connected"
}
```

## Initial Database

On first run, the service automatically:
1. Creates SQLite database at `./data/organization.db`
2. Creates all necessary tables
3. Seeds initial data:
   - Country: Tunisia (TUN)
   - Region: Tunis Centre
   - Branch: Tunis Main Branch
   - 12 predefined system roles

## Testing with curl

### Get all countries:
```bash
# Replace <token> with your JWT token
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/countries
```

### Get organization metrics:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/metrics
```

### Get all roles:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/roles
```

## Integration with Main Backend

This service is designed to work alongside the main backend service:

1. **Main Backend** runs on port `8080`
2. **Organization Service** runs on port `8081`

Both services use the same JWT authentication mechanism.

### Getting a Token

First, authenticate with the main backend:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@banking.com",
    "password": "admin123"
  }'
```

Use the returned token for Organization Service API calls.

## Common Tasks

### Adding a New Country

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FRA",
    "name": "France",
    "currencyCode": "EUR"
  }' \
  http://localhost:8081/api/organization/countries
```

### Creating a New Branch

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "regionId": "<region-id-from-db>",
    "code": "BR-SFAX-001",
    "name": "Sfax Main Branch",
    "address": "Avenue Hedi Chaker",
    "city": "Sfax",
    "postalCode": "3000",
    "phone": "+216 74 123 456",
    "email": "sfax@bank.com",
    "branchType": "Main",
    "openingDate": "2026-03-01"
  }' \
  http://localhost:8081/api/organization/branches
```

### Adding an Employee

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeCode": "EMP-00001",
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "email": "ahmed.benali@bank.com",
    "phone": "+216 92 123 456",
    "branchId": "<branch-id>",
    "roleId": "<role-id>",
    "position": "Branch Manager",
    "department": "Management",
    "employmentType": "Full-time",
    "hireDate": "2026-02-15"
  }' \
  http://localhost:8081/api/organization/employees
```

## Directory Structure

```
Services/Organization & User Service/
├── src/
│   ├── index.ts           # Main application entry point
│   ├── models/
│   │   └── index.ts       # TypeScript interfaces
│   └── database/
│       └── index.ts       # Database manager
├── data/
│   └── organization.db    # SQLite database (auto-created)
├── dist/                  # Compiled JavaScript (generated)
├── node_modules/          # Dependencies (generated)
├── README.md              # Full documentation
├── API_EXAMPLES.md        # API usage examples
├── ARCHITECTURE.md        # Architecture details
├── QUICKSTART.md          # This file
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Troubleshooting

### Port Already in Use

If port 8081 is already in use:

1. Edit `.env` file:
   ```
   PORT=8082
   ```
   
2. Or set environment variable:
   ```bash
   PORT=8082 npm run dev
   ```

### Database Issues

If you encounter database errors:

1. **Reset the database**:
   ```bash
   rm -rf data/
   npm run dev  # Will recreate database
   ```

2. **Check database manually**:
   ```bash
   sqlite3 data/organization.db
   .tables
   .schema countries
   SELECT * FROM countries;
   .quit
   ```

### Authentication Issues

Make sure you're using a valid JWT token from the main backend service.

Token should be in format:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Development Tips

### Watch Mode for TypeScript

```bash
npm run watch
```

This will recompile TypeScript files on every change.

### View Logs

Development logs appear in the console. For production, consider:

```bash
npm start > logs/service.log 2>&1 &
```

### Database Inspection

Use SQLite browser or command line:

```bash
sqlite3 data/organization.db

# Useful commands:
.tables                          # List all tables
.schema employees                # Show table schema
SELECT * FROM employees;         # Query data
SELECT * FROM roles;             # View roles
SELECT COUNT(*) FROM branches;   # Count records
```

## Next Steps

1. Read the full [README.md](./README.md) for complete documentation
2. Check [API_EXAMPLES.md](./API_EXAMPLES.md) for more API examples
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design details
4. Integrate with your frontend application
5. Add more branches, employees, and organizational structure

## Support

For issues or questions:
1. Check the documentation files
2. Review the API examples
3. Examine the database schema
4. Check service logs

## Production Deployment

For production deployment:

1. **Use PostgreSQL instead of SQLite**:
   - Update DATABASE_URL in environment
   - Modify database manager to support PostgreSQL

2. **Set environment variables**:
   ```
   NODE_ENV=production
   PORT=8081
   DATABASE_URL=postgresql://...
   JWT_SECRET=<strong-random-secret>
   ```

3. **Use process manager**:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name org-service
   pm2 startup
   pm2 save
   ```

4. **Set up reverse proxy** (nginx):
   ```nginx
   location /api/organization/ {
       proxy_pass http://localhost:8081;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

5. **Enable SSL/HTTPS**

6. **Set up monitoring** (Prometheus, Grafana)

7. **Configure log aggregation** (ELK stack)

## Important Notes

- **JWT_SECRET**: Use the same secret as the main backend for token validation
- **Database**: SQLite is for development only; use PostgreSQL for production
- **Backup**: Regularly backup the database in production
- **Security**: Always use HTTPS in production
- **Scaling**: Service is stateless and can be horizontally scaled

---

**Service Version**: 1.0.0  
**Last Updated**: February 15, 2026
