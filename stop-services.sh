#!/bin/bash

# Core Banking Microservices Stop Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       CORE BANKING - Stopping All Microservices           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

stop_service() {
    SERVICE_NAME=$1
    PID_FILE="logs/$SERVICE_NAME.pid"
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "Stopping $SERVICE_NAME (PID: $PID)..."
            kill $PID
            rm "$PID_FILE"
            echo -e "${GREEN}✓ $SERVICE_NAME stopped${NC}"
        else
            echo -e "${RED}$SERVICE_NAME not running${NC}"
            rm "$PID_FILE"
        fi
    else
        echo -e "${RED}No PID file for $SERVICE_NAME${NC}"
    fi
}

# Stop all services
stop_service "api-gateway"
stop_service "admin"
stop_service "notifications"
stop_service "transactions"
stop_service "clients"
stop_service "accounts"
stop_service "auth"

echo ""
echo -e "${GREEN}All microservices stopped${NC}"
