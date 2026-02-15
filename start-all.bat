@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         CORE BANKING PLATFORM - COMPLETE STARTUP          ║
echo ║            Client + Admin + Backend (TND)                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Starting Backend API on port 8080...
start "Core Banking Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo [2/3] Starting Client App on port 65124...
start "Core Banking Client" cmd /k "cd client && npm start"

timeout /t 3 /nobreak

echo [3/3] Starting Admin App on port 4201...
start "Core Banking Admin" cmd /k "cd admin && npm start"

echo.
echo ✅ All services starting...
echo.
echo 🌐 Applications:
echo   - Client: http://localhost:65124
echo   - Admin:  http://localhost:4201
echo   - API:    http://localhost:8080/api/health
echo.
echo 🔐 Test Credentials:
echo   Admin: admin@banking.com / admin123
echo   Client: client@banking.com / client123
echo.
echo 💰 Currency: TND (Dinar Tunisien)
echo.
pause
