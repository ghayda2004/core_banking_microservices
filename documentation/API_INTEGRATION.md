# API Integration Guide

## Backend API Configuration

This guide shows you how to integrate the Core Banking frontend with a backend API.

## API Endpoints Expected

### 1. Get Account Information
**Endpoint:** `GET /api/accounts/info`

**Response:**
```json
{
  "id": "1",
  "accountNumber": "123456789",
  "iban": "FR1420041010050500013M02606",
  "balance": 15420.50,
  "currency": "EUR",
  "accountHolder": "Jean Dupont",
  "accountType": "Compte Courant"
}
```

### 2. Get Transactions
**Endpoint:** `GET /api/accounts/transactions?limit=20`

**Response:**
```json
[
  {
    "id": "1",
    "date": "2025-02-14",
    "description": "Virement reçu - Employeur",
    "amount": 2500,
    "type": "credit",
    "status": "completed",
    "recipientName": "Acme Corp",
    "recipientIban": "FR1420041010050500013M02607"
  },
  {
    "id": "2",
    "date": "2025-02-13",
    "description": "Paiement loyer",
    "amount": 1200,
    "type": "debit",
    "status": "completed",
    "recipientName": "Jean Landlord",
    "recipientIban": "FR1420041010050500013M02608"
  }
]
```

### 3. Transfer Money
**Endpoint:** `POST /api/accounts/transfer`

**Request Body:**
```json
{
  "fromAccount": "FR1420041010050500013M02606",
  "toIban": "FR1420041010050500013M02607",
  "recipientName": "Jane Dupont",
  "amount": 500,
  "description": "Remboursement loyer",
  "transactionDate": "2025-02-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "transactionId": "TXN123456789",
  "timestamp": "2025-02-15T10:30:00Z"
}
```

### 4. Get Transaction Statistics (Optional)
**Endpoint:** `GET /api/accounts/stats`

**Response:**
```json
{
  "totalIncome": 5000,
  "totalExpense": 3200,
  "averageTransaction": 520,
  "largestTransaction": 2500,
  "transactionCount": 12
}
```

## Error Handling

The application handles API errors gracefully by:
1. Displaying error messages to users
2. Showing demo data as fallback
3. Logging errors to console

Expected error responses:
```json
{
  "error": "Invalid IBAN format",
  "message": "The provided IBAN is not valid",
  "code": 400
}
```

## CORS Configuration

Ensure your backend is configured with CORS headers:
```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Development Setup

1. **Update API URL** in `src/app/services/account.service.ts`:
```typescript
private apiUrl = 'http://YOUR_API_URL/api/accounts';
```

2. **Or use environment files** in `src/environments/environment.ts`:
```typescript
import { environment } from '../environments/environment';

// In your service
private apiUrl = `${environment.apiUrl}/accounts`;
```

## Testing with Mock Data

The application includes mock data for development. When the API is unavailable:
- Dashboard shows demo account info and transactions
- Transaction list displays sample data
- Transfer form works with validation

To disable mock data and force API calls, modify the error handler in the components.

## Production Deployment

1. Update API URL to production endpoint
2. Enable HTTPS
3. Configure proper CORS on backend
4. Add authentication/authorization if needed
5. Implement rate limiting on backend
6. Add request/response logging

## Example Backend Implementation (Node.js/Express)

```typescript
// Example backend setup
import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Account endpoints
app.get('/api/accounts/info', (req, res) => {
  // Return account info
});

app.get('/api/accounts/transactions', (req, res) => {
  // Return transactions with limit
});

app.post('/api/accounts/transfer', (req, res) => {
  // Process transfer
});

app.listen(8080, () => {
  console.log('API running on port 8080');
});
```

## Security Considerations

### Frontend
- ✅ Validate IBAN format before sending
- ✅ Sanitize user input
- ✅ Don't store sensitive data in localStorage
- ✅ Use HTTPS in production

### Backend
- ✅ Validate all inputs
- ✅ Authenticate user before processing
- ✅ Authorize transactions
- ✅ Log all transactions
- ✅ Implement rate limiting
- ✅ Use HTTPS
- ✅ Validate IBAN server-side
- ✅ Hash sensitive data

## Debugging Tips

1. **Check browser console** for error messages
2. **Use Network tab** to inspect API requests/responses
3. **Check backend logs** for server-side errors
4. **Verify CORS headers** in API responses
5. **Test with Postman** to isolate frontend/backend issues

## Useful Resources

- [REST API Best Practices](https://restfulapi.net/)
- [IBAN Validation](https://en.wikipedia.org/wiki/International_Bank_Account_Number)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [HTTP Status Codes](https://httpstatuses.com/)

---

For more information, see the main [README.md](./README.md)
