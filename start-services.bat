@echo off
REM Core Banking Microservices Startup Script for Windows

echo ============================================================
echo        CORE BANKING - Starting All Microservices
echo ============================================================
echo.

REM Create logs directory
if not exist "logs" mkdir logs

echo Starting Auth Service...
cd backend\services\auth
if not exist "node_modules" (
    echo Installing dependencies for auth...
    call npm install
)
if not exist ".env" (
    copy .env.example .env
)
if not exist "dist" (
    echo Building auth...
    call npm run build
)
start /B npm run dev > ..\..\..\logs\auth.log 2>&1
cd ..\..\..
timeout /t 2 /nobreak > nul

echo Starting Accounts Service...
cd backend\services\accounts
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\accounts.log 2>&1
cd ..\..\..

echo Starting Clients Service...
cd backend\services\clients
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\clients.log 2>&1
cd ..\..\..

echo Starting Notifications Service...
cd backend\services\notifications
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\notifications.log 2>&1
cd ..\..\..
timeout /t 2 /nobreak > nul

echo Starting Transactions Service...
cd backend\services\transactions
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\transactions.log 2>&1
cd ..\..\..
timeout /t 1 /nobreak > nul

echo Starting Admin Service...
cd backend\services\admin
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\admin.log 2>&1
cd ..\..\..
timeout /t 1 /nobreak > nul

echo Starting API Gateway...
cd backend\services\api-gateway
if not exist "node_modules" call npm install
if not exist ".env" copy .env.example .env
if not exist "dist" call npm run build
start /B npm run dev > ..\..\..\logs\api-gateway.log 2>&1
cd ..\..\..
timeout /t 2 /nobreak > nul

echo.
echo ============================================================
echo All microservices started successfully!
echo ============================================================
echo.
echo Services running on:
echo   - Auth:          http://localhost:3001
echo   - Accounts:      http://localhost:3002
echo   - Transactions:  http://localhost:3003
echo   - Clients:       http://localhost:3004
echo   - Admin:         http://localhost:3005
echo   - Notifications: http://localhost:3006
echo   - API Gateway:   http://localhost:8080
echo.
echo Health check: http://localhost:8080/api/health
echo.
echo Logs are in: .\logs\
echo.
pause
