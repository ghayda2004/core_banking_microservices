#!/bin/bash

# Core Banking Microservices Startup Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       CORE BANKING - Starting All Microservices           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}MongoDB is not running. Please start MongoDB first.${NC}"
    echo "Run: sudo systemctl start mongod"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"
echo ""

# Function to start a service
start_service() {
    SERVICE_NAME=$1
    SERVICE_DIR="backend/services/$SERVICE_NAME"
    
    if [ ! -d "$SERVICE_DIR" ]; then
        echo -e "${RED}Service directory not found: $SERVICE_DIR${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Starting $SERVICE_NAME service...${NC}"
    cd "$SERVICE_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for $SERVICE_NAME..."
        npm install > /dev/null 2>&1
    fi
    
    # Copy .env if not exists
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
    fi
    
    # Build if needed
    if [ ! -d "dist" ]; then
        echo "Building $SERVICE_NAME..."
        npm run build > /dev/null 2>&1
    fi
    
    # Start service in background
    npm run dev > "../../logs/$SERVICE_NAME.log" 2>&1 &
    SERVICE_PID=$!
    echo $SERVICE_PID > "../../logs/$SERVICE_NAME.pid"
    
    echo -e "${GREEN}✓ $SERVICE_NAME started (PID: $SERVICE_PID)${NC}"
    cd ../../..
}

# Create logs directory
mkdir -p logs

# Start services in order
echo "Starting microservices..."
echo ""

start_service "auth"
sleep 2

start_service "accounts"
start_service "clients"
start_service "notifications"
sleep 2

start_service "transactions"
sleep 1

start_service "admin"
sleep 1

start_service "api-gateway"
sleep 2

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All microservices started successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Services running on:"
echo "  → Auth:          http://localhost:3001"
echo "  → Accounts:      http://localhost:3002"
echo "  → Transactions:  http://localhost:3003"
echo "  → Clients:       http://localhost:3004"
echo "  → Admin:         http://localhost:3005"
echo "  → Notifications: http://localhost:3006"
echo "  → API Gateway:   http://localhost:8080"
echo ""
echo "Health check: http://localhost:8080/api/health"
echo ""
echo "To stop all services, run: ./stop-services.sh"
echo "Logs are in: ./logs/"
echo ""
