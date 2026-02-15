# Core Banking Platform - Complete Startup Script
# For PowerShell on Windows

Write-Host "`n╔════════════════════════════════════════════════════════════╗"
Write-Host "║         CORE BANKING PLATFORM - COMPLETE STARTUP          ║"
Write-Host "║            Client + Admin + Backend (TND)                 ║"
Write-Host "╚════════════════════════════════════════════════════════════╝`n"

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Path,
        [string]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$Path'; npm run dev" -WindowStyle Normal
}

Write-Host "[1/3] Starting Backend API..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Client App..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'client'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "[3/3] Starting Admin App..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'admin'; npm start" -WindowStyle Normal

Write-Host "`n✅ All services starting...`n" -ForegroundColor Green

Write-Host "🌐 Applications:" -ForegroundColor Yellow
Write-Host "   - Client: http://localhost:65124" -ForegroundColor Cyan
Write-Host "   - Admin:  http://localhost:4201" -ForegroundColor Cyan
Write-Host "   - API:    http://localhost:8080/api/health" -ForegroundColor Cyan

Write-Host "`n🔐 Test Credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin@banking.com / admin123" -ForegroundColor Cyan
Write-Host "   Client: client@banking.com / client123" -ForegroundColor Cyan

Write-Host "`n💰 Currency: TND (Dinar Tunisien)" -ForegroundColor Yellow
Write-Host "`n"
