"""
AQUANTICA API - FastAPI Backend
Plataforma de Gestión Inmobiliaria y Saneamiento Documental
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
    
    # Inicializar AI local (no bloquear si falla)
    try:
        from app.services.ai_local import initialize_ai
        import asyncio
        # Inicializar en background para no bloquear startup
        asyncio.create_task(initialize_ai())
        print("🧠 AI Local initialization started (background)")
    except Exception as e:
        print(f"⚠️  AI Local initialization failed: {e}")
    
    yield
    # Shutdown
    print("👋 Shutting down AQUANTICA API...")


app = FastAPI(
    title="AQUANTICA API",
    description="Plataforma de Gestión Inmobiliaria y Saneamiento Documental",
    version="1.0.0",
    lifespan=lifespan,
)

# Middleware CORS manual - se ejecuta primero
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    """Middleware CORS manual para manejar preflight y requests"""
    if request.method == "OPTIONS":
        # Responder directamente a preflight
        response = JSONResponse(content={})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response
    
    # Procesar request normal
    response = await call_next(request)
    
    # Agregar headers CORS a todas las respuestas
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# CORS - Configuración adicional del middleware de FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
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
