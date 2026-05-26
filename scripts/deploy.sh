#!/bin/bash

# AQUANTICA PLATFORM - Deploy Script
# Usage: ./scripts/deploy.sh [frontend|backend|all]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AQUANTICA PLATFORM - Deploy Script${NC}"
echo ""

# Check arguments
if [ $# -eq 0 ]; then
    echo "Usage: ./scripts/deploy.sh [frontend|backend|all]"
    echo ""
    echo "Options:"
    echo "  frontend - Deploy only frontend to Vercel"
    echo "  backend  - Deploy only backend to Railway"
    echo "  all      - Deploy both frontend and backend"
    exit 1
fi

DEPLOY_TARGET=$1

# Check if commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed. Please install it first.${NC}"
        exit 1
    fi
}

# Deploy Frontend to Vercel
deploy_frontend() {
    echo -e "${YELLOW}📦 Deploying Frontend to Vercel...${NC}"
    
    check_command "vercel"
    
    cd apps/web
    
    # Check if logged in
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}🔑 Please login to Vercel:${NC}"
        vercel login
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
}

# Deploy Backend to Railway
deploy_backend() {
    echo -e "${YELLOW}📦 Deploying Backend to Railway...${NC}"
    
    check_command "railway"
    
    cd apps/api
    
    # Check if logged in
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}🔑 Please login to Railway:${NC}"
        railway login
    fi
    
    # Check if project is linked
    if ! railway status &> /dev/null; then
        echo -e "${YELLOW}🔗 Linking to Railway project...${NC}"
        railway link
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
    railway up
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    
    # Show health check
    echo -e "${BLUE}🏥 Checking health endpoint...${NC}"
    sleep 5
    railway open
}

# Setup Environment Variables
setup_env() {
    echo -e "${YELLOW}⚙️  Setting up environment variables...${NC}"
    
    echo ""
    echo "Required environment variables:"
    echo ""
    echo "Frontend (Vercel):"
    echo "  - NEXT_PUBLIC_API_URL"
    echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo ""
    echo "Backend (Railway):"
    echo "  - DATABASE_URL"
    echo "  - CLERK_SECRET_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - PINECONE_API_KEY"
    echo ""
    echo -e "${YELLOW}⚠️  Please set these in your Vercel and Railway dashboards${NC}"
}

# Main deployment
main() {
    case $DEPLOY_TARGET in
        "frontend")
            deploy_frontend
            ;;
        "backend")
            deploy_backend
            ;;
        "all")
            deploy_backend
            echo ""
            echo -e "${BLUE}⏳ Waiting 10 seconds for backend to be ready...${NC}"
            sleep 10
            deploy_frontend
            echo ""
            setup_env
            ;;
        *)
            echo -e "${RED}❌ Invalid option: $DEPLOY_TARGET${NC}"
            echo "Usage: ./scripts/deploy.sh [frontend|backend|all]"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}🎉 Deploy completed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure environment variables in dashboard"
    echo "  2. Test the deployed application"
    echo "  3. Set up custom domain (optional)"
}

main
