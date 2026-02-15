# Core Banking - Application Fintech Moderne

Une application bancaire moderne construite avec **Angular 17**, **Tailwind CSS**, et **Lucide Angular**. Cette application offre une expérience utilisateur fintech épurée avec un design bleu nuit et blanc.

## 🎨 Caractéristiques

### Composants Principaux
- **Dashboard**: Affichage du solde, numéro de RIB, et graphique des transactions
- **Historique des transactions**: Tableau stylisé avec filtrage et recherche
- **Virement bancaire**: Formulaire complet avec validation pour envoyer de l'argent
- **Sidebar Navigation**: Menu latéral moderne pour la navigation

### Design
- Design **Fintech** épuré
- Palette de couleurs: bleu nuit (`#0F1419`) et blanc
- Coins arrondis (`rounded-xl`, `rounded-2xl`)
- Responsive (mobile, tablette, desktop)
- Animations fluides

### Technologie
- **Angular 17** (Standalone Components)
- **Tailwind CSS** pour le design
- **Lucide-Angular** pour les icônes
- **Reactive Forms** pour la validation
- **Chart.js** et **ng2-charts** pour les graphiques
- **HttpClient** pour les appels API

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── sidebar/
│   │   │   └── sidebar.component.ts
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── transaction-list/
│   │   │   └── transaction-list.component.ts
│   │   └── transfer/
│   │       └── transfer.component.ts
│   ├── services/
│   │   └── account.service.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── ...
├── index.html
├── main.ts
└── styles.css
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Installer les dépendances**
```bash
npm install --legacy-peer-deps
```

2. **Démarrer le serveur de développement**
```bash
npm start
# ou
ng serve
```

3. **Accéder à l'application**
- Ouvrez votre navigateur à `http://localhost:4200`

4. **Build pour la production**
```bash
npm run build
# ou
ng build --configuration production
```

## 🔧 Configuration des Services

### AccountService

Le service `AccountService` gère tous les appels API vers le backend bancaire.

**Configuration de base:**
```typescript
private apiUrl = 'http://localhost:8080/api/accounts';
```

**Méthodes disponibles:**
- `getAccountInfo()`: Récupère les informations du compte
- `getTransactions(limit: number)`: Récupère l'historique des transactions
- `transferMoney(request: TransferRequest)`: Effectue un virement
- `getTransactionStats()`: Récupère les statistiques

### Exemples de Requêtes API

**GET** `/api/accounts/info`
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

**GET** `/api/accounts/transactions?limit=10`
```json
[
  {
    "id": "1",
    "date": "2025-02-14",
    "description": "Virement reçu",
    "amount": 2500,
    "type": "credit",
    "status": "completed",
    "recipientName": "Acme Corp"
  }
]
```

**POST** `/api/accounts/transfer`
```json
{
  "fromAccount": "FR1420041010050500013M02606",
  "toIban": "FR1420041010050500013M02607",
  "recipientName": "Jane Dupont",
  "amount": 500,
  "description": "Remboursement",
  "transactionDate": "2025-02-15"
}
```

## 🎨 Personnalisation

### Couleurs Tailwind

Les couleurs personnalisées sont définies dans `tailwind.config.js`:
```javascript
colors: {
  'navy': '#0F1419',
  'navy-light': '#1a1f2e',
  'navy-lighter': '#252d3d',
}
```

### Styles Globaux

Modifiez les styles globaux dans `src/styles.css`.

## 📱 Pages Disponibles

- **Dashboard** (`/dashboard`): Page d'accueil avec aperçu du compte
- **Transactions** (`/transactions`): Historique complet des transactions
- **Virement** (`/transfer`): Formulaire de virement bancaire
- **Paramètres** (`/settings`): Page de paramètres (placeholder)

## 🧪 Données de Démonstration

L'application inclut des données de démonstration pour le développement. Lorsque l'API backend n'est pas disponible, les composants affichent des données fictives pour vous permettre de tester l'interface.

## 📚 Documentation des Composants

### Sidebar
```typescript
@Input() sidebarToggle: EventEmitter<boolean>
```
Menu latéral avec navigation principale.

### Dashboard
Affiche:
- Solde total avec visibilité masquée/affichée
- RIB du compte
- Statistiques rapides (revenus, dépenses, solde net)
- Graphique d'activité (Chart.js)
- Dernières transactions

### TransactionList
- Tableau complet des transactions
- Vue mobile optimisée
- Filtrage et recherche
- Pagination

### Transfer
- Formulaire complet avec validation
- Sélection du compte source
- Validation du RIB IBAN
- Calcul dynamique des frais
- Messages de succès/erreur

## 🔐 Sécurité

- Validation des formulaires côté client
- Validation IBAN regex
- HTTPS recommandé pour la production
- Masquage du solde optionnel
- Gestion d'erreurs robuste

## 🌐 Environnement

Variables d'environnement recommandées (à créer en `.env`):
```
API_URL=http://localhost:8080/api
ENVIRONMENT=development
```

## 📦 Dépendances Principales

- `@angular/core`: Framework Angular
- `@angular/forms`: Formulaires réactifs
- `tailwindcss`: Framework CSS
- `lucide-angular`: Bibliothèque d'icônes
- `chart.js`: Graphiques
- `ng2-charts`: Wrapper Angular pour Chart.js

## 🤝 Contribution

Les suggestions et améliorations sont les bienvenues !

## 📄 Licence

MIT

## 📞 Support

Pour toute question ou problème, n'hésitez pas à créer une issue dans le dépôt.

---

**Développé avec ❤️ pour une expérience bancaire moderne**
