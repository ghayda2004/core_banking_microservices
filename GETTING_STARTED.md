# Getting Started with Core Banking App

## Quick Start

### 1. Installation
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm start
```

The application will be accessible at `http://localhost:4200`

### 3. Start Backend API (if available)
```bash
# Make sure your backend is running on http://localhost:8080
# The app will show demo data if the API is unavailable
```

## Available Scripts

### Development
```bash
npm start              # Start dev server
npm run watch        # Watch for changes
```

### Production
```bash
npm run build        # Build for production
ng serve --prod     # Serve production build
```

### Testing
```bash
ng test             # Run unit tests
ng e2e             # Run e2e tests
```

## Project Features

✅ **Dashboard** - View account balance, IBAN, and recent transactions
✅ **Transaction History** - Browse all transactions with filters
✅ **Money Transfer** - Send money with form validation
✅ **Modern UI** - Fintech design with Tailwind CSS
✅ **Responsive** - Works on mobile, tablet, and desktop
✅ **Icons** - Lucide Angular icons
✅ **Charts** - Chart.js for transaction visualization

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          Dashboard component
│   │   ├── sidebar/            Navigation sidebar
│   │   ├── transaction-list/   Transaction table
│   │   └── transfer/           Transfer form
│   ├── services/
│   │   └── account.service.ts  API service
│   ├── app.component.ts        Main component
│   └── app.routes.ts           Route configuration
├── environments/
│   ├── environment.ts          Dev environment
│   └── environment.prod.ts     Production environment
├── styles.css                  Global styles
├── main.ts                     Application bootstrap
└── index.html                  HTML template
```

## Configuration

### API Endpoint
Update `src/app/services/account.service.ts`:
```typescript
private apiUrl = 'http://localhost:8080/api/accounts';
```

### Tailwind Colors
Customize colors in `tailwind.config.js`:
```javascript
colors: {
  'navy': '#0F1419',
  'navy-light': '#1a1f2e',
  'navy-lighter': '#252d3d',
}
```

## Demo Data

The application includes demo data that displays automatically when the API is unavailable. This allows you to test the UI without a backend.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### "Cannot find module" error
```bash
npm install --legacy-peer-deps
```

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Build errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Next Steps

1. **Update API endpoint** in `AccountService`
2. **Customize colors** in `tailwind.config.js`
3. **Add your backend endpoints**
4. **Deploy to production**

## Resources

- [Angular Documentation](https://angular.io)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Chart.js Guide](https://www.chartjs.org)

---

Happy coding! 🚀
