"""Projects API endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import uuid
from datetime import datetime

from app.database import get_db
from app.models.project import Project

router = APIRouter()


@router.get("/")
async def list_projects(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all projects with optional filtering"""
    # Build query
    query = select(Project)
    if status:
        query = query.where(Project.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(Project)
    if status:
        count_query = count_query.where(Project.status == status)
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get projects
    query = query.offset(skip).limit(limit).order_by(Project.createdAt.desc())
    result = await db.execute(query)
    projects = result.scalars().all()
    
    # Convert to dict
    projects_list = []
    for p in projects:
        projects_list.append({
            "id": str(p.id),
            "code": p.code,
            "title": p.title,
            "description": p.description,
            "type": p.type.value if hasattr(p.type, 'value') else p.type,
            "status": p.status.value if hasattr(p.status, 'value') else p.status,
            "createdAt": p.createdAt.isoformat() if p.createdAt else None,
            "clientId": str(p.clientId) if p.clientId else None,
            "creatorId": str(p.creatorId) if p.creatorId else None,
        })
    
    response = JSONResponse({
        "projects": projects_list,
        "total": total,
        "skip": skip,
        "limit": limit,
    })
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@router.post("/")
async def create_project(
    project: dict,
    db: AsyncSession = Depends(get_db),
):
    """Create a new project"""
    project_id = str(uuid.uuid4())
    
    # Create project object
    new_project = Project(
        id=project_id,
        code=f"AQ-{datetime.now().year}-{project_id[:4].upper()}",
        title=project.get("title", "Sin título"),
        description=project.get("description"),
        type=project.get("type", "SANEAMIENTO"),
        status="EVALUATION",
        priority="MEDIUM",
        clientId="temp-client",  # TODO: Get from authenticated user
        creatorId="temp-creator",  # TODO: Get from authenticated user
    )
    
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    
    response = JSONResponse({
        "id": str(new_project.id),
        "code": new_project.code,
        "title": new_project.title,
        "description": new_project.description,
        "type": new_project.type.value if hasattr(new_project.type, 'value') else new_project.type,
        "status": new_project.status.value if hasattr(new_project.status, 'value') else new_project.status,
        "createdAt": new_project.createdAt.isoformat() if new_project.createdAt else None,
    })
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@router.get("/{project_id}/")
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get project details with related data"""
    return {
        "id": project_id,
        "code": f"AQ-2024-{project_id[:4].upper()}",
        "title": "Proyecto de Ejemplo",
        "status": "IN_PROGRESS",
        "type": "SANEAMIENTO",
    }


@router.put("/{project_id}/")
async def update_project(
    project_id: str,
    update_data: dict,
    db: AsyncSession = Depends(get_db),
):
    """Update project data"""
    return {
        "id": project_id,
        "updated": True,
        **update_data,
    }


@router.get("/{project_id}/documents/")
async def get_project_documents(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get all documents for a project"""
    return {
        "projectId": project_id,
        "documents": [],
    }


@router.get("/{project_id}/timeline/")
async def get_project_timeline(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get timeline events for a project"""
    return {
        "projectId": project_id,
        "events": [],
    }
