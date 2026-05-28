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
    
    # Test de conexión con Ollama
    ollama_test = None
    error_msg = None
    
    if settings.AI_BASE_URL and settings.AI_MODEL_NAME:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Test básico de conectividad
                response = await client.get(f"{settings.AI_BASE_URL}/v1/models")
                ollama_test = {
                    "models_endpoint_status": response.status_code,
                    "models": response.json() if response.status_code == 200 else None
                }
                
                # Test de chat simple
                chat_response = await client.post(
                    f"{settings.AI_BASE_URL}/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.AI_API_KEY}"},
                    json={
                        "model": settings.AI_MODEL_NAME,
                        "messages": [{"role": "user", "content": "hola"}],
                        "max_tokens": 50
                    }
                )
                ollama_test["chat_endpoint_status"] = chat_response.status_code
                ollama_test["chat_response_preview"] = chat_response.text[:200] if chat_response.status_code == 200 else chat_response.text
                
        except Exception as e:
            error_msg = str(e)
            ollama_test = {"error": error_msg}
    
    return {
        "ai_base_url": settings.AI_BASE_URL,
        "ai_model_name": settings.AI_MODEL_NAME,
        "ai_api_key_set": bool(settings.AI_API_KEY),
        "ai_type": get_ai_type(),
        "ollama_available": ollama_ai.available,
        "connection_test": ollama_test,
    }


@router.get("/test-chat")
async def ai_test_chat():
    """Test directo de chat con Ollama"""
    if not settings.AI_BASE_URL or not settings.AI_MODEL_NAME:
        return {"error": "Ollama no configurado", "type": "local"}
    
    try:
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.AI_BASE_URL}/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.AI_API_KEY}"},
                json={
                    "model": settings.AI_MODEL_NAME,
                    "messages": [
                        {"role": "system", "content": "Eres AURA de AQUANTICA. Responde brevemente."},
                        {"role": "user", "content": "hola, ¿qué servicios ofreces?"}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 200,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "success",
                    "type": "ollama",
                    "response": data["choices"][0]["message"]["content"],
                    "model": settings.AI_MODEL_NAME
                }
            else:
                return {
                    "status": "error",
                    "http_status": response.status_code,
                    "response_text": response.text
                }
                
    except Exception as e:
        return {
            "status": "exception",
            "error": str(e),
            "type": "error"
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
