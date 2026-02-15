# Database Seeding Scripts

This directory contains scripts to seed the MongoDB databases with initial data.

## Usage

1. Make sure MongoDB is running on `localhost:27017`

2. Install dependencies:
```bash
npm install
```

3. Run the seed script:
```bash
npm run seed
```

This will:
- Clear all existing data
- Create admin and client users
- Create a client profile
- Create a sample account with balance
- Create sample transactions
- Create sample notifications

## Test Credentials

After seeding, you can login with:

**Admin:**
- Email: `admin@banking.com`
- Password: `admin123`

**Client:**
- Email: `client@banking.com`
- Password: `client123`

## Sample Data Created

- **Users:** 2 (1 admin, 1 client)
- **Clients:** 1 client profile
- **Accounts:** 1 account with 15,420.50 TND balance
- **Transactions:** 3 sample transactions
- **Notifications:** 2 sample notifications
