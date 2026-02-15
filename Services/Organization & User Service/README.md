# Organization & User Service

## 📋 Overview

The **Organization & User Service** is a core microservice responsible for managing the bank's organizational structure, employee management, role-based access control, and digital banking user management. This service provides a comprehensive solution for hierarchical organization management and user administration in a modern core banking system.

## 🎯 Key Responsibilities

### 1. Bank Structure Management
- **Country Level**: Multi-country banking operations support
- **Regional Level**: Regional divisions and territories
- **Branch/Agency Level**: Individual branch/agency management
- **Hierarchical Relationships**: Parent-child relationships between organizational units

### 2. Employee Management
- Employee profile management (personal info, contact details, employment info)
- Employee-branch assignments and transfers
- Employment status tracking (active, suspended, terminated, on-leave)
- Position and department tracking
- Employee search and filtering

### 3. Role & Permission System (RBAC)
- Predefined banking roles (Admin, Regional Manager, Branch Manager, Teller, Loan Officer, etc.)
- Custom role creation and management
- Granular permission system (read, write, approve, delete)
- Role assignment to employees
- Permission inheritance and hierarchical access control

### 4. Digital Banking Users (Clients)
- Client user registration and onboarding
- Profile management for digital banking customers
- User-branch relationship management
- KYC (Know Your Customer) data management
- User status management (active, suspended, blocked)

### 5. Internal Hierarchy
- Organizational chart structure
- Manager-subordinate relationships
- Reporting lines and approval workflows
- Department and team structures
- Hierarchical data access and visibility

## 🏗️ Architecture

### Service Type
- **Pattern**: Microservice
- **Technology Stack**: Node.js + TypeScript + Express
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Authentication**: JWT-based with role validation
- **API Style**: RESTful

### Data Model Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  ORGANIZATION & USER SERVICE                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   COUNTRY    │    │    REGION    │    │    BRANCH    │  │
│  │              │◄───│              │◄───│              │  │
│  │  - id        │    │  - id        │    │  - id        │  │
│  │  - code      │    │  - country   │    │  - region    │  │
│  │  - name      │    │  - code      │    │  - code      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                 ▲            │
│                                                 │            │
│  ┌──────────────┐    ┌──────────────┐         │            │
│  │   EMPLOYEE   │    │     ROLE     │         │            │
│  │              │───►│              │         │            │
│  │  - id        │    │  - id        │         │            │
│  │  - branch ───┼────┼──────────────┘         │            │
│  │  - role      │                              │            │
│  │  - manager   │                              │            │
│  │  - position  │                              │            │
│  └──────┬───────┘    ┌──────────────┐         │            │
│         │            │  PERMISSION  │         │            │
│         │            │              │         │            │
│         │            │  - id        │         │            │
│         │            │  - role      │         │            │
│         │            │  - resource  │         │            │
│         │            │  - action    │         │            │
│         │            └──────────────┘         │            │
│         │                                     │            │
│  ┌──────▼───────┐                            │            │
│  │  CLIENT USER │────────────────────────────┘            │
│  │              │                                          │
│  │  - id        │                                          │
│  │  - branch    │                                          │
│  │  - status    │                                          │
│  │  - kyc       │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Countries Table
```sql
CREATE TABLE countries (
  id UUID PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,        -- ISO 3166-1 alpha-3 (e.g., TUN, FRA)
  name VARCHAR(100) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,      -- ISO 4217 (e.g., TND, EUR)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Regions Table
```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Branches Table
```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY,
  region_id UUID REFERENCES regions(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(100),
  branch_type VARCHAR(50),               -- Main, Sub-branch, Agency, ATM Center
  is_active BOOLEAN DEFAULT true,
  opening_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  level INTEGER,                         -- Hierarchy level (1=highest)
  is_system_role BOOLEAN DEFAULT false,  -- Cannot be deleted if true
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  role_id UUID REFERENCES roles(id),
  resource VARCHAR(100) NOT NULL,        -- accounts, transactions, users, etc.
  action VARCHAR(50) NOT NULL,           -- read, write, approve, delete
  scope VARCHAR(50),                     -- own, branch, region, country, all
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Employees Table
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  branch_id UUID REFERENCES branches(id),
  role_id UUID REFERENCES roles(id),
  manager_id UUID REFERENCES employees(id),  -- Self-referencing for hierarchy
  position VARCHAR(100),
  department VARCHAR(100),
  employment_type VARCHAR(50),           -- Full-time, Part-time, Contract
  employment_status VARCHAR(50),         -- Active, Suspended, Terminated, On-Leave
  hire_date DATE,
  termination_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Client Users Table
```sql
CREATE TABLE client_users (
  id UUID PRIMARY KEY,
  user_code VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  branch_id UUID REFERENCES branches(id), -- Home branch
  status VARCHAR(50),                     -- Active, Suspended, Blocked, Pending
  kyc_status VARCHAR(50),                 -- Pending, Verified, Rejected
  document_type VARCHAR(50),              -- CIN, Passport, etc.
  document_number VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country_id UUID REFERENCES countries(id),
  registration_date DATE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Country Management

#### Get All Countries
```http
GET /api/organization/countries
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "code": "TUN",
    "name": "Tunisia",
    "currencyCode": "TND",
    "isActive": true,
    "createdAt": "2026-02-15T..."
  }
]
```

#### Create Country
```http
POST /api/organization/countries
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "FRA",
  "name": "France",
  "currencyCode": "EUR"
}

Response: 201 Created
```

#### Update Country
```http
PUT /api/organization/countries/:id
Authorization: Bearer <token>
```

#### Delete Country
```http
DELETE /api/organization/countries/:id
Authorization: Bearer <token>
```

### Region Management

#### Get All Regions
```http
GET /api/organization/regions?countryId=<uuid>
Authorization: Bearer <token>
```

#### Create Region
```http
POST /api/organization/regions
Authorization: Bearer <token>

{
  "countryId": "uuid",
  "code": "TUNIS-CENTER",
  "name": "Tunis Centre"
}
```

### Branch Management

#### Get All Branches
```http
GET /api/organization/branches?regionId=<uuid>
Authorization: Bearer <token>
```

#### Get Branch Details
```http
GET /api/organization/branches/:id
Authorization: Bearer <token>
```

#### Create Branch
```http
POST /api/organization/branches
Authorization: Bearer <token>

{
  "regionId": "uuid",
  "code": "BR-TUNIS-001",
  "name": "Tunis Main Branch",
  "address": "Avenue Habib Bourguiba",
  "city": "Tunis",
  "postalCode": "1000",
  "phone": "+216 71 123 456",
  "email": "tunis.main@bank.com",
  "branchType": "Main"
}
```

#### Update Branch
```http
PUT /api/organization/branches/:id
Authorization: Bearer <token>
```

### Role Management

#### Get All Roles
```http
GET /api/organization/roles
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "code": "BRANCH_MANAGER",
    "name": "Branch Manager",
    "description": "Manages branch operations",
    "level": 3,
    "permissions": [...]
  }
]
```

#### Create Role
```http
POST /api/organization/roles
Authorization: Bearer <token>

{
  "code": "LOAN_OFFICER",
  "name": "Loan Officer",
  "description": "Handles loan applications and approvals",
  "level": 4
}
```

#### Assign Permissions to Role
```http
POST /api/organization/roles/:id/permissions
Authorization: Bearer <token>

{
  "permissions": [
    {
      "resource": "loans",
      "action": "read",
      "scope": "branch"
    },
    {
      "resource": "loans",
      "action": "approve",
      "scope": "branch"
    }
  ]
}
```

### Employee Management

#### Get All Employees
```http
GET /api/organization/employees?branchId=<uuid>&status=active
Authorization: Bearer <token>
```

#### Get Employee Details
```http
GET /api/organization/employees/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "employeeCode": "EMP-001",
  "firstName": "Ahmed",
  "lastName": "Ben Ali",
  "email": "ahmed.benali@bank.com",
  "phone": "+216 92 123 456",
  "branch": {
    "id": "uuid",
    "name": "Tunis Main Branch"
  },
  "role": {
    "id": "uuid",
    "name": "Branch Manager"
  },
  "manager": {
    "id": "uuid",
    "name": "Regional Manager"
  },
  "position": "Branch Manager",
  "department": "Operations",
  "employmentStatus": "Active",
  "hireDate": "2020-01-15"
}
```

#### Create Employee
```http
POST /api/organization/employees
Authorization: Bearer <token>

{
  "employeeCode": "EMP-002",
  "firstName": "Fatma",
  "lastName": "Trabelsi",
  "email": "fatma.trabelsi@bank.com",
  "phone": "+216 92 456 789",
  "branchId": "uuid",
  "roleId": "uuid",
  "managerId": "uuid",
  "position": "Teller",
  "department": "Customer Service",
  "employmentType": "Full-time",
  "hireDate": "2023-03-01"
}
```

#### Update Employee
```http
PUT /api/organization/employees/:id
Authorization: Bearer <token>
```

#### Transfer Employee
```http
POST /api/organization/employees/:id/transfer
Authorization: Bearer <token>

{
  "newBranchId": "uuid",
  "effectiveDate": "2026-03-01",
  "reason": "Branch expansion"
}
```

#### Get Employee Hierarchy
```http
GET /api/organization/employees/:id/hierarchy
Authorization: Bearer <token>

Response: 200 OK
{
  "employee": {...},
  "manager": {...},
  "subordinates": [...]
}
```

### Client User Management

#### Get All Client Users
```http
GET /api/organization/users?branchId=<uuid>&status=active
Authorization: Bearer <token>
```

#### Get Client User Details
```http
GET /api/organization/users/:id
Authorization: Bearer <token>
```

#### Create Client User
```http
POST /api/organization/users
Authorization: Bearer <token>

{
  "userCode": "USR-001",
  "firstName": "Mohamed",
  "lastName": "Gharbi",
  "email": "mohamed.gharbi@email.com",
  "phone": "+216 98 123 456",
  "dateOfBirth": "1990-05-20",
  "branchId": "uuid",
  "documentType": "CIN",
  "documentNumber": "12345678",
  "address": "123 Rue de la Liberté",
  "city": "Tunis",
  "postalCode": "1000",
  "countryId": "uuid"
}
```

#### Update Client User Status
```http
PATCH /api/organization/users/:id/status
Authorization: Bearer <token>

{
  "status": "Suspended",
  "reason": "Suspicious activity"
}
```

#### Update KYC Status
```http
PATCH /api/organization/users/:id/kyc
Authorization: Bearer <token>

{
  "kycStatus": "Verified",
  "verifiedBy": "uuid",
  "notes": "All documents verified"
}
```

### Organization Hierarchy

#### Get Organization Chart
```http
GET /api/organization/chart?level=branch&id=<uuid>
Authorization: Bearer <token>

Response: 200 OK
{
  "branch": {...},
  "manager": {...},
  "employees": [
    {
      "employee": {...},
      "subordinates": [...]
    }
  ]
}
```

#### Get Reporting Structure
```http
GET /api/organization/reporting/:employeeId
Authorization: Bearer <token>
```

## 🔐 Security & Access Control

### Authentication
- JWT-based authentication required for all endpoints
- Token validation via existing IAM service

### Authorization Levels
1. **System Admin**: Full access to all organization management
2. **Regional Manager**: Access to region and below
3. **Branch Manager**: Access to branch and below
4. **HR Officer**: Employee management within scope
5. **Regular Employee**: Read-only access to own data

### Permission Scopes
- `all`: Global access across all organizational units
- `country`: Access to specific country and below
- `region`: Access to specific region and below
- `branch`: Access to specific branch
- `own`: Access to own data only

## 📈 Service Health & Monitoring

### Health Check Endpoint
```http
GET /api/organization/health

Response: 200 OK
{
  "status": "healthy",
  "service": "Organization & User Service",
  "version": "1.0.0",
  "timestamp": "2026-02-15T...",
  "database": "connected",
  "dependencies": {
    "iam": "healthy"
  }
}
```

### Metrics Endpoint
```http
GET /api/organization/metrics
Authorization: Bearer <token>

Response: 200 OK
{
  "totalCountries": 5,
  "totalRegions": 25,
  "totalBranches": 150,
  "totalEmployees": 1250,
  "totalClientUsers": 45000,
  "activeEmployees": 1200,
  "activeClientUsers": 42000
}
```

## 🚀 Deployment & Configuration

### Environment Variables
```env
PORT=8081
DATABASE_URL=postgresql://user:pass@localhost:5432/org_service
JWT_SECRET=your-secret-key
IAM_SERVICE_URL=http://localhost:8082
LOG_LEVEL=info
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 8081
CMD ["npm", "start"]
```

## 🧪 Testing

### Unit Tests
- Model validation tests
- Service logic tests
- Utility function tests

### Integration Tests
- API endpoint tests
- Database operation tests
- Authentication/authorization tests

### Test Coverage Goal
- Minimum 80% code coverage
- 100% coverage for critical paths (permissions, hierarchy)

## 📚 Usage Examples

### Example 1: Creating Complete Organization Structure
```javascript
// 1. Create Country
POST /api/organization/countries
{ "code": "TUN", "name": "Tunisia", "currencyCode": "TND" }

// 2. Create Region
POST /api/organization/regions
{ "countryId": "...", "code": "TUNIS", "name": "Tunis Region" }

// 3. Create Branch
POST /api/organization/branches
{ "regionId": "...", "code": "BR-001", "name": "Tunis Main" }

// 4. Create Roles
POST /api/organization/roles
{ "code": "BRANCH_MGR", "name": "Branch Manager", "level": 3 }

// 5. Create Employee
POST /api/organization/employees
{ "branchId": "...", "roleId": "...", "firstName": "Ahmed", ... }
```

### Example 2: Setting Up Role Permissions
```javascript
// Create role with permissions
POST /api/organization/roles
{
  "code": "TELLER",
  "name": "Bank Teller",
  "level": 5
}

POST /api/organization/roles/:roleId/permissions
{
  "permissions": [
    { "resource": "accounts", "action": "read", "scope": "branch" },
    { "resource": "transactions", "action": "create", "scope": "branch" },
    { "resource": "customers", "action": "read", "scope": "branch" }
  ]
}
```

## 🔄 Integration with Other Services

### Dependencies
- **IAM Service**: Authentication and token validation
- **Customer Service**: Customer account linking
- **Account Service**: Account-branch relationships
- **Transaction Service**: Transaction approval workflows

### Events Published
- `employee.created`
- `employee.updated`
- `employee.transferred`
- `branch.created`
- `user.registered`
- `user.status.changed`

## 📝 Best Practices

1. **Always validate organizational hierarchy**: Ensure regions belong to countries, branches to regions
2. **Enforce permission checks**: Always validate user permissions before operations
3. **Maintain audit logs**: Track all changes to employees, roles, and organizational structure
4. **Use transactions**: Wrap related operations (e.g., employee creation + role assignment) in DB transactions
5. **Implement soft deletes**: Never hard delete organizational data
6. **Cache frequently accessed data**: Countries, regions, roles, permissions
7. **Implement rate limiting**: Protect endpoints from abuse
8. **Version the API**: Use versioning for backward compatibility

## 🛠️ Development

### Setup
```bash
cd Services/Organization\ &\ User\ Service
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## 📄 License
Part of Core Banking Microservices Platform

## 👥 Maintainers
Banking Platform Team

---
**Version**: 1.0.0  
**Last Updated**: February 15, 2026
