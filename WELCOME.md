# 🏦 Core Banking Platform - Installation Finale

## ✅ Déploiement Réussi!

Vous avez maintenant une **plateforme Core Banking complète** avec:

### 🎯 3 Applications

1. **Frontend Client** (Port 65124)
   - Interface pour clients bancaires
   - Devise: TND (Dinar Tunisien)
   - Affichage solde, virement, historique

2. **Frontend Admin/Banquier** (Port 4201)
   - Gestion des comptes, clients, transactions
   - Validation des virements
   - Surveillance des microservices
   - Blocage/déblocage de comptes

3. **Backend API** (Port 8080)
   - Microservices (Authentification, Comptes, Transactions, Clients)
   - JWT Authentication
   - Database in-memory (ready for SQLite upgrade)

---

## 🚀 Démarrage Rapide

### Option 1: Script automatique (Recommandé)

#### Windows CMD:
```bash
start-all.bat
```

#### PowerShell:
```powershell
.\start-all.ps1
```

### Option 2: Démarrage manuel (3 terminaux)

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
✅ Serveur API sur http://localhost:8080

#### Terminal 2 - Client:
```bash
cd client
npm start
```
✅ Application client sur http://localhost:65124

#### Terminal 3 - Admin:
```bash
cd admin
npm start
```
✅ Application admin sur http://localhost:4201

---

## 🔐 Identifiants de Test

### Administrateur/Banquier:
```
Email: admin@banking.com
Mot de passe: admin123
Accès: http://localhost:4201/login
```

### Client:
```
Email: client@banking.com
Mot de passe: client123
Accès: http://localhost:65124
```

---

## 🏗️ Architecture Microservices

### Microservices implémentés:

1. **Authentification Service**
   - Login / Register
   - JWT tokens (24h)
   - Password hashing (bcrypt)

2. **Gestion des Comptes**
   - Informations compte
   - Solde en TND
   - IBAN (format tunisien: TN5910006...)

3. **Transactions Service**
   - Virement d'argent
   - Historique
   - Statut (pending/completed/failed)

4. **Gestion Clients**
   - Liste des clients
   - Document d'identité (CIN, Passeport)
   - Statut (active/blocked/inactive)

### API Endpoints:

```
POST   /api/auth/login                      # Connexion
POST   /api/auth/register                   # Inscription

GET    /api/accounts/info                   # Info compte
GET    /api/accounts/transactions           # Historique
POST   /api/accounts/transfer               # Virement

GET    /api/admin/accounts                  # Tous comptes (Admin)
GET    /api/admin/clients                   # Tous clients (Admin)
GET    /api/admin/transactions              # Toutes transactions (Admin)
POST   /api/admin/transactions/:id/validate # Valider (Admin)
PATCH  /api/admin/accounts/:id/status       # Bloquer (Admin)

GET    /api/health                          # Health check
```

---

## 💰 Devise: TND (Dinar Tunisien)

Toutes les montants sont en **TND** (Dinar Tunisien):
- Client: 15,420.50 TND
- Formats: 1234.56 TND
- Symbol: د.ت

---

## 📱 Fonctionnalités Client

✅ **Dashboard**
- Solde en TND
- IBAN tunisien (TN5910006...)
- Graphique d'activité
- Dernières transactions

✅ **Transactions**
- Historique complet
- Filtrage et recherche
- Pagination

✅ **Virement**
- Validation IBAN
- Sélection compte source
- Frais (gratuit dans démo)
- Statut en temps réel

---

## 👨‍💼 Fonctionnalités Admin

✅ **Dashboard Admin**
- Statistiques en temps réel
- 4 comptes actifs
- Solde total
- Transactions en attente

✅ **Gestion Comptes**
- Liste de tous les comptes
- Solde par compte
- Bloquer/débloquer

✅ **Gestion Transactions**
- Valider transactions
- Rejeter transactions
- Historique complet

✅ **Gestion Clients**
- Infos clients
- Document d'identité
- Bloquer/débloquer

✅ **Supervision Services**
- Health check
- Statut de chaque microservice

---

## 📊 Structure de Données

### User/Authentification
```typescript
{
  id: UUID,
  email: string,
  password: bcrypt,
  name: string,
  role: 'client' | 'admin' | 'banker'
}
```

### Account (Compte Bancaire)
```typescript
{
  id: UUID,
  accountNumber: string,
  iban: string (TN5910006...),
  userId: UUID,
  balance: number (en TND),
  currency: 'TND',
  accountType: 'Compte Courant',
  accountHolder: string,
  status: 'active' | 'blocked' | 'inactive'
}
```

### Transaction (Virement)
```typescript
{
  id: UUID,
  fromAccountId: UUID,
  toIban: string,
  toRecipient: string,
  amount: number (en TND),
  currency: 'TND',
  type: 'debit' | 'credit',
  status: 'pending' | 'completed' | 'failed',
  description: string,
  validatedBy: UUID (banquier),
  validatedAt: Date
}
```

### Client (Info Client)
```typescript
{
  id: UUID,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  country: string,
  documentType: 'CIN' | 'Passeport',
  documentNumber: string,
  status: 'active' | 'blocked' | 'inactive'
}
```

---

## 🔐 Sécurité Implémentée

✅ **Authentification**
- JWT tokens (durée 24h)
- Mots de passe hashés (bcryptjs)

✅ **Autorisation**
- Role-based access (client/admin/banker)
- Middleware de vérification

✅ **Validation**
- IBAN regex
- Email validation
- Vérification solde

✅ **Audit**
- Transaction logging
- Validation timestamp
- Nom du validateur

---

## 🛠️ Troubleshooting

### Port déjà utilisé?
```bash
# Modifier le port dans le code
# Backend: backend/src/index.ts (PORT)
# Client: client/package.json (ng serve --port)
# Admin: admin/package.json (ng serve --port)
```

### Erreur de connexion API?
1. Vérifier que le backend est démarré (port 8080)
2. Vérifier les logs du backend
3. Vérifier la console navigateur (F12)

### Token expiré?
```
Relancer l'application ou se reconnecter
```

### Database vide?
La base est en mémoire, les données se réinitialisent à chaque redémarrage.
Pour persister, ajouter SQLite:
```bash
npm install sqlite3 --save
```

---

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble
- **ARCHITECTURE.md** - Architecture détaillée
- **API_INTEGRATION.md** - Endpoints API
- **COMPONENTS.md** - Détails composants
- **LAUNCH.md** - Guide de lancement

---

## 🚀 Prochaines Étapes

### 1. Persistance des données
```bash
cd backend
npm install sqlite3
# Modifier index.ts pour utiliser SQLite
```

### 2. Authentification avancée
- Refresh tokens
- Forgot password
- 2FA (Two-Factor Auth)

### 3. Fonctionnalités supplémentaires
- Notifications
- Rapports PDF
- Export CSV
- Dashboard analytics

### 4. Déploiement production
```bash
# Build client
cd client && npm run build

# Build admin
cd admin && npm run build

# Build backend
cd backend && npm run build

# Déployer sur hosting (Vercel, AWS, Heroku)
```

---

## 📋 Checklist Démarrage

- [ ] Backend démarré (8080)
- [ ] Client accessible (65124)
- [ ] Admin accessible (4201)
- [ ] Able to login admin (admin@banking.com)
- [ ] Able to view dashboard
- [ ] Voir tous les comptes (Admin)
- [ ] Voir tous les clients (Admin)
- [ ] Voir transactions (Admin)
- [ ] Pouvoir faire virement (Client)

---

## 💬 Support

Pour toute question:
1. Consulter la documentation (ARCHITECTURE.md)
2. Vérifier les logs du backend
3. Vérifier la console navigateur (F12)
4. Vérifier les credentials (admin@banking.com / admin123)

---

## 📄 Informations Projet

- **Nom**: Core Banking Platform
- **Version**: 1.0.0
- **Devise**: TND (Dinar Tunisien)
- **Framework**: Angular 17 + Node.js + Express
- **Base de données**: In-Memory (prêt pour SQLite)
- **Authentification**: JWT
- **Créé**: 15 Février 2026

---

## 🎉 Bienvenue dans Core Banking!

Vous avez une plateforme bancaire complète et opérationnelle.

**Commencez par:**
1. Démarrer les services (script ou terminal)
2. Accéder à http://localhost:4201 (Admin)
3. Se connecter: admin@banking.com / admin123
4. Explorer le dashboard et la gestion des comptes

---

**Bonne chance! 🚀**

*Made with ❤️ for Tunisian Banking*
