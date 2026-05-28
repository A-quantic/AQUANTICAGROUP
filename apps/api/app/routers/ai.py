"""AI API endpoints - Usa Ollama cuando está configurado"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
import uuid

from app.config import settings

# Intentar usar Ollama si está configurado, sino fallback a AI local
if settings.AI_BASE_URL and settings.AI_MODEL_NAME:
    from app.services.ai_ollama import chat_with_ollama as chat_with_ai
    from app.services.ai_ollama import ollama_ai
    AI_TYPE = "ollama"
else:
    from app.services.ai_local import chat_with_ai
    from app.services.ai_local import ai_local
    AI_TYPE = "local"

# Fallbacks opcionales
from app.services.ai_hybrid import (
    analyze_document,
    generate_checklist,
    detect_missing_documents,
)

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(request: dict):
    """Public AI chat endpoint usando modelo NLP local RAG"""
    message = request.get("message", "")
    session_id = request.get("session_id", str(uuid.uuid4()))
    
    try:
        # Usar AI local con RAG
        response = await chat_with_ai(
            message=message,
            context_type="public",
        )
        return {
            "response": response,
            "session_id": session_id,
            "model": "AQUANTICA-AI-Local-v1",
            "type": "rag"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def ai_status():
    """Estado del AI"""
    if AI_TYPE == "ollama":
        from app.services.ai_ollama import ollama_ai
        return {
            "type": "ollama",
            "available": ollama_ai.available,
            "base_url": ollama_ai.base_url,
            "model": ollama_ai.model_name,
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
