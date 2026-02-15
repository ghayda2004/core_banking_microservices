# 🚀 Application Launch Guide

## Pre-Launch Checklist

- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ Project cloned/downloaded
- ✅ Dependencies installed (`npm install --legacy-peer-deps`)

## Quick Start (60 seconds)

### Step 1: Navigate to Project
```powershell
cd c:\Users\ghayd\Documents\banking
```

### Step 2: Install Dependencies
```powershell
npm install --legacy-peer-deps
```
This may take 2-3 minutes on first run.

### Step 3: Start Development Server
```powershell
npm start
```

### Step 4: Open Browser
Navigate to: **http://localhost:4200**

## Alternative Methods

### Using Angular CLI
```powershell
ng serve
```

### Using ng serve with custom port
```powershell
ng serve --port 4300
```

### Build and preview production build
```powershell
npm run build
npm run start -- --configuration production
```

## What You'll See

1. **Angular compilation message** (takes ~30-60 seconds first time)
```
✔ Compiled successfully.
✔ Build at: 2026-02-15T17:29:29.022Z
```

2. **Live development server** starts
3. **Browser automatically opens** (or manually visit http://localhost:4200)

## First Interaction

### Dashboard Page (Default)
- Account balance display
- IBAN information
- Activity chart
- Recent transactions
- Quick stats

### Navigation
- Click menu items in sidebar to navigate
- Or click navbar toggle on mobile

## Demo Data

The app works perfectly without a backend! You'll see:
- Sample account with €15,420.50 balance
- 5 demo transactions
- Activity chart with sample data
- Working forms with validation

## Troubleshooting

### Port 4200 Already in Use
```powershell
# Use different port
ng serve --port 4300
```

### Module Not Found Error
```powershell
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

### TypeScript Compilation Error
```powershell
# Clear Angular cache
ng cache clean
npm install --legacy-peer-deps
```

### Network Issues
```powershell
# Clear npm cache
npm cache clean --force
npm install --legacy-peer-deps
```

## Backend Integration (Optional)

When ready to connect to a backend API:

1. **Update API URL** in `src/app/services/account.service.ts`:
```typescript
private apiUrl = 'http://YOUR_API_URL/api/accounts';
```

2. **Or use environment file** `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

3. **Backend must support these endpoints:**
   - `GET /api/accounts/info`
   - `GET /api/accounts/transactions?limit=20`
   - `POST /api/accounts/transfer`

## Development Features

### Hot Module Replacement (HMR)
Changes to code automatically reload in browser (no refresh needed).

### TypeScript Strict Mode
Full type checking enabled for safety.

### Tailwind CSS Dev Mode
Utility classes available for instant styling.

### Source Maps
Debug TypeScript in browser DevTools.

## File Structure During Development

```
banking/
├── src/                     # Source code
│   ├── app/                # Application components
│   ├── environments/       # Environment configs
│   ├── styles.css         # Global styles
│   ├── main.ts            # Bootstrap file
│   └── index.html         # HTML template
├── dist/                  # Build output (after npm run build)
├── node_modules/          # Dependencies
└── package.json           # Project metadata
```

## Browser DevTools Tips

### Angular DevTools Extension
Recommended for debugging Angular applications:
1. Install "Angular DevTools" from Chrome Web Store
2. Open DevTools (F12)
3. Navigate to "Angular" tab
4. Inspect components, services, and routing

### Console Debugging
The app logs useful information to console:
```javascript
// Watch API calls
// View error messages
// Debug component lifecycle
```

## Terminal Output Explained

### Successful Start
```
✔ Compiled successfully.

✔ Building...
✔ Build at: 2026-02-15T17:29:29.022Z - Hash: bc8f809e92e08f23
*** Server is listening on http://localhost:4200/ ***
```

### Watch Mode
After initial compilation, the terminal will show:
```
✔ Build complete. Watching for file changes...
```

Changes to files automatically trigger recompilation.

### Common Messages
- `✔` = Success
- `⚠` = Warning (usually safe to ignore)
- `✖` = Error (needs fixing)

## Testing the Application

### Test Dashboard
1. Click "Dashboard" in sidebar
2. Verify:
   - Balance displays correctly
   - IBAN shows in card
   - Chart renders
   - Recent transactions list appears

### Test Transactions
1. Click "Transactions" in sidebar
2. Verify:
   - Transactions display
   - Mobile view works (resize window)
   - Filter/Search buttons visible

### Test Transfer Form
1. Click "Virement" in sidebar
2. Test validation:
   - Submit with empty fields (should fail)
   - Enter invalid IBAN (should show error)
   - Fill valid form (should allow submit)
   - Check success message appears

### Test Responsive Design
1. Press F12 to open DevTools
2. Click device toggle (mobile icon)
3. Select different device sizes
4. Verify layout adapts correctly

## Performance Monitoring

In Chrome DevTools:

1. **Performance Tab**
   - Record page load
   - Analyze timeline
   - Check memory usage

2. **Network Tab**
   - View API calls (once backend connected)
   - Check bundle sizes
   - Monitor load times

3. **Coverage Tab**
   - See CSS/JS coverage
   - Identify unused code

## Making Code Changes

### Editing Components
1. Open file in VS Code (e.g., `src/app/components/dashboard/dashboard.component.ts`)
2. Make changes
3. Save file
4. Browser automatically reloads

### Editing Styles
1. Open `src/styles.css`
2. Add Tailwind classes or custom CSS
3. Save
4. Styles instantly update

### Editing Routes
1. Open `src/app/app.routes.ts`
2. Add/modify routes
3. Save
4. Router updates instantly

## Building for Production

When ready to deploy:

```powershell
npm run build
```

This creates optimized production build in `dist/banking-app/`:
- Minified JavaScript
- Optimized CSS
- Tree-shaken code
- Source maps (optional)

## Stopping the Server

In terminal:
- Press `Ctrl + C` to stop the development server
- Confirm with `Y` if prompted

## Next Steps

1. **Explore the Code**
   - Open components in `src/app/components/`
   - Review styles in `src/styles.css`
   - Check routes in `src/app/app.routes.ts`

2. **Customize Design**
   - Update colors in `tailwind.config.js`
   - Modify Sidebar user info
   - Change dashboard welcome message

3. **Connect Backend**
   - Follow `API_INTEGRATION.md` guide
   - Update API endpoints
   - Test with real data

4. **Add Features**
   - Add user authentication
   - Create account settings page
   - Implement user profiles
   - Add more charts/reports

5. **Deploy**
   - Build production version
   - Choose hosting (Vercel, Netlify, AWS, etc.)
   - Configure domain
   - Setup SSL certificate

## Getting Help

### Check Documentation
- **README.md** - Project overview
- **API_INTEGRATION.md** - Backend setup
- **COMPONENTS.md** - Component details
- **GETTING_STARTED.md** - Installation guide

### Common Issues
- Port already in use → Use different port
- Dependencies issue → Reinstall with `--legacy-peer-deps`
- API not found → Ensure backend is running
- Styles not applying → Clear browser cache

## Tips for Success

✅ Keep terminal open during development
✅ Use VS Code for best experience
✅ Install Angular DevTools extension
✅ Use Chrome/Firefox DevTools for debugging
✅ Check browser console for errors
✅ Read error messages carefully
✅ Test on different screen sizes
✅ Test form validation thoroughly
✅ Commit changes to git regularly

---

## Ready to Launch! 🚀

```powershell
npm start
```

Your banking app will be running in seconds!

Visit: **http://localhost:4200**

Happy coding! 💻✨
