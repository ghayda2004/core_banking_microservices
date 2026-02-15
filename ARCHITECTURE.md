# Core Banking Platform - Architecture Complète

## 🏗️ Vue d'ensemble Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CORE BANKING PLATFORM                       │
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
│              │   BACKEND API (Node.js)  │                      │
│              │      :8080 (TND)         │                      │
│              └───────────┬──────────────┘                      │
│                          │                                     │
│        ┌─────────────────┼─────────────────┐                   │
│        │                 │                 │                   │
│    ┌──▼───────┐  ┌──────▼───┐  ┌──────────▼────┐             │
│    │ COMPTES   │  │ CLIENTS   │  │ TRANSACTIONS  │             │
│    │ (Service) │  │(Service)  │  │  (Service)    │             │
│    └───────────┘  └───────────┘  └───────────────┘             │
│                                                                 │
│              ┌──────────────────────────────┐                   │
│              │   DATABASE (SQLite)          │                   │
│              │   ./data/banking.db          │                   │
│              └──────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Applications

### 1. **Client App** (Port 65124)
- Interface utilisateur pour les clients bancaires
- Affichage du solde, transactions, virement
- Devise: **Dinar Tunisien (TND)**

### 2. **Admin App** (Port 4201)
- Tableau de bord pour les banquiers/administrateurs
- Gestion des comptes, clients, transactions
- Supervision des microservices
- Validation des transactions
- Blocage/déblocage de comptes et clients

### 3. **Backend API** (Port 8080)
- **Node.js + Express + TypeScript**
- API RESTful complète
- Authentification JWT
- 4 Microservices:
  - **Authentification** (Login/Register)
  - **Gestion des Comptes** (Balance, IBAN)
  - **Transactions** (Virement, Historique)
  - **Clients** (Gestion des clients)

## 🔐 Services Métiers

### 1. Authentification
```
POST /api/auth/login
{
  "email": "admin@banking.com",
  "password": "admin123"
}
```

### 2. Gestion des Comptes
```
GET  /api/accounts/info              # Infos du compte
GET  /api/accounts/transactions      # Historique
POST /api/accounts/transfer          # Effectuer virement
```

### 3. Gestion Admin
```
GET  /api/admin/accounts             # Tous les comptes
GET  /api/admin/clients              # Tous les clients
GET  /api/admin/transactions         # Toutes les transactions
POST /api/admin/transactions/:id/validate  # Valider
POST /api/admin/transactions/:id/reject    # Rejeter
PATCH /api/admin/accounts/:id/status      # Bloquer compte
PATCH /api/admin/clients/:id/status       # Bloquer client
```

## 🛠️ Installation & Démarrage

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation Complète

```bash
# 1. Installer les dépendances du backend
cd backend
npm install
cd ..

# 2. Installer les dépendances du client
cd ../client (src renommé)
npm install --legacy-peer-deps
cd ..

# 3. Installer les dépendances de l'admin
cd admin
npm install --legacy-peer-deps
cd ..
```

### Démarrage des Services

#### Option 1: Démarrer séparément
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Client
cd client
npm start

# Terminal 3: Admin
cd admin
npm start
```

#### Option 2: Démarrer tous ensemble
```bash
npm run start:all
```

## 🔐 Comptes de Test

### Admin/Banquier
- **Email**: admin@banking.com
- **Mot de passe**: admin123
- **Accès**: http://localhost:4201/login

### Client
- **Email**: client@banking.com
- **Mot de passe**: client123
- **Accès**: http://localhost:65124

## 📊 Structure des Données

### User (Authentification)
```typescript
{
  id: string;
  email: string;
  password: string (bcrypt);
  name: string;
  role: 'client' | 'admin' | 'banker';
  createdAt: Date;
}
```

### Account (Compte Bancaire)
```typescript
{
  id: string;
  accountNumber: string;
  iban: string;           // Format TN (Tunisie)
  userId: string;
  balance: number;        // En TND
  currency: 'TND';        // Dinar Tunisien
  accountType: string;    // Ex: Compte Courant
  accountHolder: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
}
```

### Transaction (Virement)
```typescript
{
  id: string;
  fromAccountId: string;
  toAccountId?: string;
  toIban?: string;
  toRecipient?: string;
  amount: number;         // En TND
  currency: 'TND';
  type: 'debit' | 'credit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
  validatedBy?: string;   // ID du banquier
  validatedAt?: Date;
}
```

### Client (Données Client)
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  documentType: string;   // CIN, Passeport, etc.
  documentNumber: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
}
```

## 🔄 Flux Métier

### 1. Nouvelle Inscription Client
```
1. Client remplit formulaire
2. POST /api/auth/register
3. Account créé avec solde 0
4. Client reçoit token JWT
5. Accès au tableau de bord
```

### 2. Virement d'Argent
```
1. Client soumet formulaire de virement
2. POST /api/accounts/transfer
3. Vérification du solde
4. Débiter compte source
5. Enregistrer transaction (status: completed/pending)
6. Admin valide si "pending"
```

### 3. Gestion Admin
```
1. Admin se connecte
2. Voit tableau de bord avec stats
3. Valide/Rejette transactions en attente
4. Peut bloquer/débloquer comptes
5. Peut bloquer/débloquer clients
6. Vérifier santé des services
```

## 🔗 Authentification JWT

```typescript
// Token généré au login
{
  userId: string;
  email: string;
  role: 'client' | 'admin' | 'banker';
  expiresIn: '24h';
}

// Utilisé dans header Authorization
Authorization: Bearer <token>
```

## 🛡️ Sécurité

- ✅ Mots de passe hashés (bcryptjs)
- ✅ JWT pour authentification
- ✅ Validation côté serveur
- ✅ IBAN validation regex
- ✅ Vérification des soldes
- ✅ Audit des transactions
- ✅ CORS configuré

## 📈 Surveillance des Services

```
GET /api/health

{
  "status": "healthy",
  "services": {
    "accounts": "running",
    "transactions": "running",
    "clients": "running",
    "auth": "running"
  },
  "timestamp": "2026-02-15T...",
}
```

## 💰 Support de Devise

- **TND** = Dinar Tunisien
- Symbole: د.ت
- Format: 1234.56 TND

## 📁 Structure du Projet

```
banking/
├── backend/                  # API Node.js
│   ├── src/
│   │   └── index.ts         # Serveur principal
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── client/                   # App Client (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   ├── package.json
│   └── angular.json
│
├── admin/                    # App Admin (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   ├── package.json
│   └── angular.json
│
└── data/                     # Base de données
    └── banking.db
```

## 🚀 Déploiement Production

### Backend (Node.js)
```bash
cd backend
npm run build
npm start
```

### Frontend Client & Admin
```bash
cd client
npm run build
# Deploy dist/banking-app

cd admin
npm run build
# Deploy dist/banking-admin
```

## 📚 Documentation Additionnelle

- [API Integration Guide](./API_INTEGRATION.md)
- [Components Documentation](./COMPONENTS.md)
- [Launch Guide](./LAUNCH.md)

## 🤝 Support

Pour toute question ou problème:
1. Vérifier les logs du backend
2. Vérifier la connexion API
3. Vérifier les credentials
4. Consulter la console du navigateur

---

**Core Banking Platform v1.0.0**
- Currency: TND (Dinar Tunisien)
- Langs: Angular 17 + Node.js + TypeScript
- Created: February 15, 2026
