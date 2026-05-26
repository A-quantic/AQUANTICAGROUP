"""Documents API endpoints"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.database import get_db
from app.services.storage import upload_to_s3
from app.services.ai import analyze_document

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    project_id: Optional[str] = Form(None),
    expediente_id: Optional[str] = Form(None),
    category: str = Form("OTROS"),
    db: AsyncSession = Depends(get_db),
):
    """Upload and process a document"""
    
    # Generate unique ID
    document_id = str(uuid.uuid4())
    
    # Upload to S3
    file_key = f"documents/{document_id}/{file.filename}"
    file_url = await upload_to_s3(file, file_key)
    
    # Analyze with AI (background)
    analysis = await analyze_document(file, category)
    
    return {
        "id": document_id,
        "name": file.filename,
        "type": file.content_type,
        "category": category,
        "fileUrl": file_url,
        "fileKey": file_key,
        "projectId": project_id,
        "expedienteId": expediente_id,
        "aiAnalysis": analysis,
        "uploadedById": "placeholder",
    }


@router.get("/")
async def list_documents(
    project_id: Optional[str] = None,
    expediente_id: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List documents with filtering"""
    return {
        "documents": [],
        "filters": {
            "projectId": project_id,
            "expedienteId": expediente_id,
            "category": category,
        },
    }


@router.get("/{document_id}")
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get document details"""
    return {
        "id": document_id,
        "name": "Documento.pdf",
        "fileUrl": "https://example.com/document.pdf",
    }


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a document"""
    return {"deleted": True, "id": document_id}
