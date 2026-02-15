# API Examples - Organization & User Service

This document provides practical examples of using the Organization & User Service API.

## Authentication

All API endpoints (except health check) require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
http://localhost:8081
```

## Examples

### 1. Health Check

Check if the service is running:

```bash
curl http://localhost:8081/api/organization/health
```

Response:
```json
{
  "status": "healthy",
  "service": "Organization & User Service",
  "version": "1.0.0",
  "timestamp": "2026-02-15T...",
  "database": "connected"
}
```

### 2. Get Organization Metrics

Get overall statistics:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/metrics
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCountries": 5,
    "totalRegions": 25,
    "totalBranches": 150,
    "totalEmployees": 1250,
    "totalClientUsers": 45000,
    "activeEmployees": 1200,
    "activeClientUsers": 42000,
    "activeBranches": 148
  }
}
```

### 3. Country Management

#### List all countries
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/countries
```

#### Create a country
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FRA",
    "name": "France",
    "currencyCode": "EUR"
  }' \
  http://localhost:8081/api/organization/countries
```

#### Update a country
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Republic of France",
    "isActive": true
  }' \
  http://localhost:8081/api/organization/countries/<country-id>
```

### 4. Region Management

#### List all regions
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/regions
```

#### List regions by country
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/regions?countryId=<country-id>"
```

#### Create a region
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "countryId": "<country-id>",
    "code": "RG-PARIS",
    "name": "Paris Region"
  }' \
  http://localhost:8081/api/organization/regions
```

### 5. Branch Management

#### List all branches
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/branches
```

#### List branches by region
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/branches?regionId=<region-id>"
```

#### Get branch details with statistics
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/branches/<branch-id>
```

Response includes employee and client counts:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "code": "BR-TUNIS-001",
    "name": "Tunis Main Branch",
    "address": "Avenue Habib Bourguiba",
    "city": "Tunis",
    "branchType": "Main",
    "employeeCount": 45,
    "clientCount": 1250,
    "region_name": "Tunis Centre",
    "country_name": "Tunisia"
  }
}
```

#### Create a branch
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "regionId": "<region-id>",
    "code": "BR-TUNIS-002",
    "name": "Tunis Lac Branch",
    "address": "Les Berges du Lac",
    "city": "Tunis",
    "postalCode": "1053",
    "phone": "+216 71 456 789",
    "email": "lac@bank.com",
    "branchType": "Sub-branch",
    "openingDate": "2025-01-15"
  }' \
  http://localhost:8081/api/organization/branches
```

#### Update a branch
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+216 71 456 790",
    "email": "tunis.lac@bank.com",
    "isActive": true
  }' \
  http://localhost:8081/api/organization/branches/<branch-id>
```

### 6. Role Management

#### List all roles with permissions
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/roles
```

#### Create a custom role
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SENIOR_TELLER",
    "name": "Senior Bank Teller",
    "description": "Experienced teller with additional responsibilities",
    "level": 5
  }' \
  http://localhost:8081/api/organization/roles
```

#### Assign permissions to a role
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": [
      {
        "resource": "accounts",
        "action": "read",
        "scope": "branch"
      },
      {
        "resource": "accounts",
        "action": "write",
        "scope": "branch"
      },
      {
        "resource": "transactions",
        "action": "read",
        "scope": "branch"
      },
      {
        "resource": "transactions",
        "action": "write",
        "scope": "branch"
      },
      {
        "resource": "customers",
        "action": "read",
        "scope": "branch"
      }
    ]
  }' \
  http://localhost:8081/api/organization/roles/<role-id>/permissions
```

### 7. Employee Management

#### List all employees
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/employees
```

#### Filter employees
```bash
# By branch
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/employees?branchId=<branch-id>"

# By department
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/employees?department=Operations"

# By status
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/employees?status=Active"

# Search by name or email
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/employees?search=ahmed"
```

#### Get employee details
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/employees/<employee-id>
```

#### Create an employee
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeCode": "EMP-00125",
    "firstName": "Ahmed",
    "lastName": "Ben Ali",
    "email": "ahmed.benali@bank.com",
    "phone": "+216 92 123 456",
    "branchId": "<branch-id>",
    "roleId": "<role-id>",
    "managerId": "<manager-id>",
    "position": "Senior Teller",
    "department": "Customer Service",
    "employmentType": "Full-time",
    "hireDate": "2026-02-15"
  }' \
  http://localhost:8081/api/organization/employees
```

#### Update an employee
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Lead Teller",
    "department": "Operations",
    "phone": "+216 92 123 457"
  }' \
  http://localhost:8081/api/organization/employees/<employee-id>
```

#### Transfer an employee to another branch
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newBranchId": "<new-branch-id>",
    "effectiveDate": "2026-03-01",
    "reason": "Branch expansion - additional staff needed"
  }' \
  http://localhost:8081/api/organization/employees/<employee-id>/transfer
```

#### Get employee hierarchy (manager and subordinates)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/employees/<employee-id>/hierarchy
```

Response:
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "...",
      "employeeCode": "EMP-00100",
      "firstName": "Ahmed",
      "lastName": "Ben Ali",
      "branch_name": "Tunis Main Branch",
      "role_name": "Branch Manager"
    },
    "manager": {
      "id": "...",
      "firstName": "Fatma",
      "lastName": "Trabelsi",
      "role_name": "Regional Manager"
    },
    "subordinates": [
      {
        "id": "...",
        "firstName": "Mohamed",
        "lastName": "Gharbi",
        "role_name": "Teller"
      },
      {
        "id": "...",
        "firstName": "Leila",
        "lastName": "Mansour",
        "role_name": "Customer Service Rep"
      }
    ],
    "subordinateCount": 2
  }
}
```

### 8. Client User Management

#### List all client users
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/users
```

#### Filter client users
```bash
# By branch
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/users?branchId=<branch-id>"

# By status
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/users?status=Active"

# By KYC status
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/users?kycStatus=Verified"

# Search
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/organization/users?search=mohamed"
```

#### Get client user details
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/users/<user-id>
```

#### Create a client user (onboarding)
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userCode": "USR-00012345",
    "firstName": "Mohamed",
    "lastName": "Gharbi",
    "email": "mohamed.gharbi@email.com",
    "phone": "+216 98 123 456",
    "dateOfBirth": "1990-05-20",
    "branchId": "<branch-id>",
    "documentType": "CIN",
    "documentNumber": "12345678",
    "address": "123 Rue de la Liberté",
    "city": "Tunis",
    "postalCode": "1000",
    "countryId": "<country-id>"
  }' \
  http://localhost:8081/api/organization/users
```

#### Update client user status
```bash
# Suspend user
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Suspended",
    "reason": "Suspicious activity detected"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/status

# Activate user
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active",
    "reason": "Issue resolved"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/status

# Block user
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Blocked",
    "reason": "Fraud detected"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/status
```

#### Update KYC status
```bash
# Verify KYC
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "kycStatus": "Verified",
    "verifiedBy": "<employee-id>",
    "notes": "All documents verified successfully"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/kyc

# Reject KYC
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "kycStatus": "Rejected",
    "verifiedBy": "<employee-id>",
    "notes": "Invalid document provided"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/kyc
```

## Complete Workflow Examples

### Example 1: Setting Up a New Branch

```bash
# 1. Create the branch
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "regionId": "<region-id>",
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

# Get the branch-id from response

# 2. Create Branch Manager
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeCode": "EMP-00200",
    "firstName": "Sami",
    "lastName": "Karoui",
    "email": "sami.karoui@bank.com",
    "phone": "+216 92 555 111",
    "branchId": "<new-branch-id>",
    "roleId": "<branch-manager-role-id>",
    "managerId": "<regional-manager-id>",
    "position": "Branch Manager",
    "department": "Management",
    "employmentType": "Full-time",
    "hireDate": "2026-02-20"
  }' \
  http://localhost:8081/api/organization/employees

# 3. Create Tellers
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeCode": "EMP-00201",
    "firstName": "Nadia",
    "lastName": "Hamdi",
    "email": "nadia.hamdi@bank.com",
    "phone": "+216 92 555 222",
    "branchId": "<new-branch-id>",
    "roleId": "<teller-role-id>",
    "managerId": "<branch-manager-id>",
    "position": "Senior Teller",
    "department": "Customer Service",
    "employmentType": "Full-time",
    "hireDate": "2026-02-25"
  }' \
  http://localhost:8081/api/organization/employees
```

### Example 2: Onboarding a New Client

```bash
# 1. Create client user account
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userCode": "USR-00098765",
    "firstName": "Amira",
    "lastName": "Ben Youssef",
    "email": "amira.benyoussef@email.com",
    "phone": "+216 98 777 888",
    "dateOfBirth": "1995-08-15",
    "branchId": "<branch-id>",
    "documentType": "CIN",
    "documentNumber": "87654321",
    "address": "456 Avenue de la République",
    "city": "Tunis",
    "postalCode": "1001",
    "countryId": "<tunisia-id>"
  }' \
  http://localhost:8081/api/organization/users

# Get the user-id from response

# 2. Verify KYC
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "kycStatus": "Verified",
    "verifiedBy": "<employee-id>",
    "notes": "CIN verified, all documents complete"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/kyc

# 3. Activate user
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active",
    "reason": "KYC completed successfully"
  }' \
  http://localhost:8081/api/organization/users/<user-id>/status
```

### Example 3: Employee Promotion and Transfer

```bash
# 1. Get current employee details
curl -H "Authorization: Bearer <token>" \
  http://localhost:8081/api/organization/employees/<employee-id>

# 2. Update employee role (promotion)
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Operations Manager",
    "department": "Operations"
  }' \
  http://localhost:8081/api/organization/employees/<employee-id>

# 3. Transfer to new branch
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newBranchId": "<new-branch-id>",
    "effectiveDate": "2026-04-01",
    "reason": "Promoted to Operations Manager at larger branch"
  }' \
  http://localhost:8081/api/organization/employees/<employee-id>/transfer
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (missing required fields, validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `500`: Internal server error

## Notes

1. All dates should be in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`
2. UUIDs are used for all entity IDs
3. Employee codes follow pattern: `EMP-XXXXXX` (4-6 digits)
4. User codes follow pattern: `USR-XXXXXXXX` (6-8 digits)
5. Branch codes follow pattern: `BR-LOCATION-XXX`
6. Region codes follow pattern: `RG-LOCATION`
7. Country codes are ISO 3166-1 alpha-3 (3 letters)
8. Currency codes are ISO 4217 (3 letters)
