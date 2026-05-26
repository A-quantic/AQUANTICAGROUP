"""AI API endpoints"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
import uuid

from app.services.ai_hybrid import (
    analyze_document,
    chat_with_context,
    generate_checklist,
    detect_missing_documents,
)

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(request: dict):
    """Public AI chat endpoint for website visitors"""
    message = request.get("message", "")
    session_id = request.get("session_id", str(uuid.uuid4()))
    
    try:
        response = await chat_with_context(
            message=message,
            session_id=session_id,
            context_type="public",
        )
        return {
            "response": response,
            "session_id": session_id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
