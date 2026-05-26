#!/bin/bash

# AQUANTICA PLATFORM - Local Development Setup
# Usage: ./scripts/setup-local.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 AQUANTICA PLATFORM - Local Setup${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Database will need manual setup${NC}"
fi

echo -e "${BLUE}📦 Installing root dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}📦 Installing web dependencies...${NC}"
cd apps/web
npm install
cd ../..

echo ""
echo -e "${BLUE}📦 Installing database dependencies...${NC}"
cd packages/database
npm install
npx prisma generate
cd ../..

echo ""
echo -e "${BLUE}📦 Setting up Python environment...${NC}"
cd apps/api
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ../..

echo ""
echo -e "${BLUE}⚙️  Creating environment files...${NC}"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual credentials${NC}"
fi

# Create .env.local for web if it doesn't exist
if [ ! -f "apps/web/.env.local" ]; then
    cat > apps/web/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
EOL
    echo -e "${YELLOW}⚠️  Please edit apps/web/.env.local with your Clerk key${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your credentials"
echo "  2. Start database: docker-compose up postgres -d"
echo "  3. Run migrations: cd packages/database && npx prisma migrate dev"
echo "  4. Start backend: cd apps/api && source venv/bin/activate && uvicorn main:app --reload"
echo "  5. Start frontend: cd apps/web && npm run dev"
echo ""
echo "Or simply run: docker-compose up"
