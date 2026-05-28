"""AI API endpoints - Usa Ollama cuando está configurado"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
import uuid

from app.config import settings
from app.services.ai_ollama import chat_with_ollama, OllamaAI
from app.services.ai_local import chat_with_ai as chat_local
from app.services.ai_hybrid import (
    analyze_document,
    generate_checklist,
    detect_missing_documents,
)

# Instancia de Ollama para verificar disponibilidad
ollama_ai = OllamaAI()

def get_ai_type():
    """Determinar qué AI usar basado en configuración actual"""
    if settings.AI_BASE_URL and settings.AI_MODEL_NAME:
        return "ollama"
    return "local"

def get_chat_function():
    """Obtener función de chat según configuración"""
    if get_ai_type() == "ollama":
        return chat_with_ollama
    return chat_local

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(request: dict):
    """Public AI chat endpoint usando modelo NLP"""
    message = request.get("message", "")
    session_id = request.get("session_id", str(uuid.uuid4()))
    
    try:
        # Usar función de AI según configuración
        chat_func = get_chat_function()
        response = await chat_func(
            message=message,
            context_type="public",
        )
        return {
            "response": response,
            "session_id": session_id,
            "model": "AQUANTICA-AI-Ollama" if get_ai_type() == "ollama" else "AQUANTICA-AI-Local",
            "type": get_ai_type()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def ai_status():
    """Estado del AI"""
    ai_type = get_ai_type()
    if ai_type == "ollama":
        return {
            "type": "ollama",
            "available": ollama_ai.available,
            "base_url": settings.AI_BASE_URL,
            "model": settings.AI_MODEL_NAME,
            "provider": "Ollama via ngrok"
        }
    else:
        from app.services.ai_local import ai_local
        return {
            "type": "local",
            "initialized": ai_local.initialized,
            "model": "Rule-based + TinyLlama (if available)",
            "provider": "Local AI"
        }


@router.get("/debug")
async def ai_debug():
    """Debug - Ver configuración de AI (solo para desarrollo)"""
    return {
        "ai_base_url": settings.AI_BASE_URL,
        "ai_model_name": settings.AI_MODEL_NAME,
        "ai_api_key_set": bool(settings.AI_API_KEY),
        "ai_type": get_ai_type(),
        "ollama_available": ollama_ai.available,
    }


@router.post("/analyze-document")
async def analyze_document_endpoint(
    file: UploadFile = File(...),
    document_type: Optional[str] = None,
):
    """Analyze uploaded document with AI"""
    try:
        result = await analyze_document(file, document_type)
        return {
            "document_id": str(uuid.uuid4()),
            "analysis": result,
            "extracted_data": result.get("extracted_data", {}),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-checklist")
async def generate_checklist_endpoint(request: dict):
    """Generate document checklist based on project type"""
    project_type = request.get("project_type")
    municipality = request.get("municipality")
    
    try:
        checklist = await generate_checklist(project_type, municipality)
        return {"checklist": checklist}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect-missing")
async def detect_missing_endpoint(request: dict):
    """Detect missing documents from uploaded list"""
    uploaded_docs = request.get("documents", [])
    project_type = request.get("project_type")
    
    try:
        missing = await detect_missing_documents(uploaded_docs, project_type)
        return {
            "missing_documents": missing,
            "completion_percentage": (len(uploaded_docs) / (len(uploaded_docs) + len(missing))) * 100,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
