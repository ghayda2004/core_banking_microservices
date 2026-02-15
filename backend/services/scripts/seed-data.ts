import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB URIs
const AUTH_DB = 'mongodb://localhost:27017/core_banking_auth';
const ACCOUNTS_DB = 'mongodb://localhost:27017/core_banking_accounts';
const TRANSACTIONS_DB = 'mongodb://localhost:27017/core_banking_transactions';
const CLIENTS_DB = 'mongodb://localhost:27017/core_banking_clients';
const NOTIFICATIONS_DB = 'mongodb://localhost:27017/core_banking_notifications';

// Schemas
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

const AccountSchema = new mongoose.Schema({
  accountNumber: String,
  iban: String,
  userId: String,
  balance: Number,
  currency: String,
  accountType: String,
  accountHolder: String,
  status: String
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  fromAccountId: String,
  toIban: String,
  toRecipient: String,
  amount: Number,
  currency: String,
  type: String,
  status: String,
  description: String,
}, { timestamps: true });

const ClientSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  documentType: String,
  documentNumber: String,
  status: String
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  title: String,
  message: String,
  read: Boolean,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Connect to Auth DB
    console.log('📦 Seeding Auth Database...');
    const authConn = await mongoose.createConnection(AUTH_DB).asPromise();
    const User = authConn.model('User', UserSchema);
    
    await User.deleteMany({});
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);
    
    const adminUser = await User.create({
      email: 'admin@banking.com',
      password: adminPassword,
      name: 'Admin Banker',
      role: 'admin'
    });
    
    const clientUser = await User.create({
      email: 'client@banking.com',
      password: clientPassword,
      name: 'Jean Dupont',
      role: 'client'
    });
    
    console.log('✅ Created admin user: admin@banking.com / admin123');
    console.log('✅ Created client user: client@banking.com / client123\n');

    // Connect to Clients DB
    console.log('📦 Seeding Clients Database...');
    const clientsConn = await mongoose.createConnection(CLIENTS_DB).asPromise();
    const Client = clientsConn.model('Client', ClientSchema);
    
    await Client.deleteMany({});
    
    await Client.create({
      userId: clientUser._id.toString(),
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'client@banking.com',
      phone: '+216 92 123 456',
      address: '123 Rue de Tunis',
      city: 'Tunis',
      country: 'Tunisia',
      documentType: 'CIN',
      documentNumber: '12345678',
      status: 'active'
    });
    
    console.log('✅ Created client profile for Jean Dupont\n');

    // Connect to Accounts DB
    console.log('📦 Seeding Accounts Database...');
    const accountsConn = await mongoose.createConnection(ACCOUNTS_DB).asPromise();
    const Account = accountsConn.model('Account', AccountSchema);
    
    await Account.deleteMany({});
    
    const clientAccount = await Account.create({
      accountNumber: '123456789',
      iban: 'TN5910006035183885671999',
      userId: clientUser._id.toString(),
      balance: 15420.50,
      currency: 'TND',
      accountType: 'Compte Courant',
      accountHolder: 'Jean Dupont',
      status: 'active'
    });
    
    console.log('✅ Created account for Jean Dupont (Balance: 15420.50 TND)\n');

    // Connect to Transactions DB
    console.log('📦 Seeding Transactions Database...');
    const transactionsConn = await mongoose.createConnection(TRANSACTIONS_DB).asPromise();
    const Transaction = transactionsConn.model('Transaction', TransactionSchema);
    
    await Transaction.deleteMany({});
    
    await Transaction.create([
      {
        fromAccountId: clientAccount._id.toString(),
        toRecipient: 'Acme Corp',
        amount: 2500,
        currency: 'TND',
        type: 'credit',
        status: 'completed',
        description: 'Virement reçu - Employeur',
        createdAt: new Date('2025-02-14')
      },
      {
        fromAccountId: clientAccount._id.toString(),
        toRecipient: 'Jean Landlord',
        amount: 1200,
        currency: 'TND',
        type: 'debit',
        status: 'completed',
        description: 'Paiement loyer',
        createdAt: new Date('2025-02-13')
      },
      {
        fromAccountId: clientAccount._id.toString(),
        toIban: 'TN5910006035183885671888',
        toRecipient: 'Marie Martin',
        amount: 500,
        currency: 'TND',
        type: 'debit',
        status: 'completed',
        description: 'Virement',
        createdAt: new Date('2025-02-12')
      }
    ]);
    
    console.log('✅ Created 3 sample transactions\n');

    // Connect to Notifications DB
    console.log('📦 Seeding Notifications Database...');
    const notificationsConn = await mongoose.createConnection(NOTIFICATIONS_DB).asPromise();
    const Notification = notificationsConn.model('Notification', NotificationSchema);
    
    await Notification.deleteMany({});
    
    await Notification.create([
      {
        userId: clientUser._id.toString(),
        type: 'transaction',
        title: 'Virement reçu',
        message: 'Vous avez reçu un virement de 2500 TND',
        read: false,
        metadata: { amount: 2500 }
      },
      {
        userId: clientUser._id.toString(),
        type: 'account',
        title: 'Bienvenue',
        message: 'Bienvenue dans Core Banking!',
        read: true
      }
    ]);
    
    console.log('✅ Created 2 sample notifications\n');

    // Close all connections
    await authConn.close();
    await clientsConn.close();
    await accountsConn.close();
    await transactionsConn.close();
    await notificationsConn.close();

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          DATABASE SEEDING COMPLETED SUCCESSFULLY           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n🎉 All databases have been seeded with initial data!\n');
    console.log('Test Credentials:');
    console.log('  Admin: admin@banking.com / admin123');
    console.log('  Client: client@banking.com / client123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
