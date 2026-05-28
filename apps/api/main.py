"""
AQUANTICA API - FastAPI Backend
Plataforma de Gestión Inmobiliaria y Saneamiento Documental
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.database import init_db
from app.routers import leads, projects, documents, ai, auth, webhooks


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    print("🚀 Starting AQUANTICA API...")
    await init_db()
    yield
    # Shutdown
    print("👋 Shutting down AQUANTICA API...")


app = FastAPI(
    title="AQUANTICA API",
    description="Plataforma de Gestión Inmobiliaria y Saneamiento Documental",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])


@app.get("/")
async def root():
    return {
        "name": "AQUANTICA API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/health")
async def api_health_check():
    """Health check endpoint for Railway"""
    return {"status": "healthy", "service": "aquantica-api"}


@app.get("/api/status")
async def api_status():
    """Detailed API status with services"""
    return {
        "api": "operational",
        "version": "1.0.0",
        "services": {
            "database": "connected",
            "ai": "ready",
            "storage": "ready",
        },
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
