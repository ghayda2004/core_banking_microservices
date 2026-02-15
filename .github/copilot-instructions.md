# Copilot Instructions - Core Banking App

## Project Overview

**Core Banking** est une application bancaire fintech moderne construite avec:
- Angular 17 (Standalone Components)
- Tailwind CSS
- Lucide-Angular pour les icônes
- Chart.js pour les graphiques
- Reactive Forms pour la validation

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── sidebar/           # Navigation principale
│   │   ├── dashboard/         # Affichage du solde et aperçu
│   │   ├── transaction-list/  # Historique des transactions
│   │   └── transfer/          # Formulaire de virement
│   ├── services/
│   │   └── account.service.ts # API interaction
│   ├── app.component.ts       # Composant racine
│   └── app.routes.ts          # Configuration des routes
├── styles.css                 # Styles globaux
├── main.ts                    # Point d'entrée
└── index.html                 # Template HTML
```

## Development

### Installation
```bash
npm install --legacy-peer-deps
```

### Démarrer le serveur dev
```bash
npm start
# Application accessible à http://localhost:4200
```

### Build pour production
```bash
npm run build
```

## Architecture

### AccountService
- `getAccountInfo()` - Récupère infos du compte
- `getTransactions(limit)` - Historique des transactions
- `transferMoney(request)` - Effectue un virement
- Base URL: `http://localhost:8080/api/accounts`

### Composants Standalone
Tous les composants utilisent l'API standalone d'Angular 17:
- Imports directs sans NgModule
- Components autonomes et réutilisables
- Reactive Forms pour la validation

## Design System

### Couleurs
- `navy`: #0F1419 (Background principal)
- `navy-light`: #1a1f2e (Cartes/backgrounds secondaires)
- `navy-lighter`: #252d3d (Bordures/hover)
- `blue-600`: #2563eb (Actions/accents)

### Spacing & Radius
- Coins arrondis: `rounded-xl` (8px), `rounded-2xl` (16px)
- Padding standard: `p-6`, `p-4`
- Responsive: Classes `md:` pour tablette+

## Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirige vers /dashboard |
| `/dashboard` | DashboardComponent | Page d'accueil |
| `/transactions` | TransactionListComponent | Historique complet |
| `/transfer` | TransferComponent | Formulaire de virement |
| `/settings` | Placeholder | Page de paramètres |

## Guidelines de Développement

### Pour ajouter une nouvelle fonctionnalité
1. Créer le composant dans `src/app/components/[feature]`
2. Ajouter la route dans `app.routes.ts`
3. Utiliser AccountService pour l'API
4. Utiliser Lucide pour les icônes
5. Appliquer les styles Tailwind existants

### Validation de formulaires
Utiliser ReactiveFormsModule avec `FormBuilder`:
- Validators.required
- Validators.pattern() pour IBAN
- Validators.minLength/maxLength
- Custom validators si nécessaire

### Appels API
Gestion d'erreurs :
- Afficher les données de démo si l'API n'est pas disponible
- Messages d'erreur clairs à l'utilisateur
- Loading states pendant les requêtes

## Configuration Backend

L'API attend sur `http://localhost:8080/api/accounts`

### Endpoints requis

**GET /accounts/info**
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

**GET /accounts/transactions?limit=10**
```json
[{
  "id": "1",
  "date": "2025-02-14",
  "description": "Virement reçu",
  "amount": 2500,
  "type": "credit",
  "status": "completed"
}]
```

**POST /accounts/transfer**
Accepte: `TransferRequest` interface

## Responsive Design

- Mobile: Full width, stack layouts
- Tablette (md:): Deux colonnes, sidebars collapsibles
- Desktop: Three-column layouts possible

Classes helpers:
- `hidden md:block` - Masquer sur mobile
- `md:grid-cols-3` - Responsive grid
- `md:flex-row` - Direction row sur tablette+

## Performance Notes

- Angular 17 standalone components (moins de boilerplate)
- Tree-shaking automatique avec imports
- Chart.js: Lazy initialization après AfterViewInit
- Tailwind: Production CSS minifié (~15KB)

## Dépannage

### Erreur: "Cannot find module"
```bash
npm install --legacy-peer-deps
```

### Erreur Chart.js
Vérifier que `afterViewInit()` est appelé pour initialiser le canvas

### Erreur CORS sur API
Configurer le backend avec CORS headers ou utiliser proxy

## Testing

Placeholder pour tests unitaires:
- Tester AccountService avec HttpClientTestingModule
- Tester validation de formulaires
- Tester événements de composants

## Security Notes

- Validation côté client des RIB IBAN
- Validation sur backend aussi (pas de trust client)
- Masquage optionnel du solde
- HTTPS en production obligatoire

## Production Checklist

- [ ] Backend API configuré et accessible
- [ ] HTTPS activé
- [ ] Proxies CORS configurés
- [ ] Variables d'environnement configurées
- [ ] Build testé: `npm run build`
- [ ] Assets optimisés (images, icônes)

## Resources

- [Angular 17 Documentation](https://angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Chart.js](https://www.chartjs.org)
- [Reactive Forms](https://angular.io/guide/reactive-forms)

---

**Last Updated**: 2025-02-15
