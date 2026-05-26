"""Leads API endpoints"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.schemas.lead import LeadCreate, LeadResponse
from app.services.ai import classify_lead_with_ai
from app.services.notifications import send_notification

router = APIRouter()


@router.post("/", response_model=LeadResponse)
async def create_lead(
    lead: LeadCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Create a new lead and trigger AI classification"""
    
    # TODO: Create lead in database via Prisma
    lead_id = str(uuid.uuid4())
    
    # Background AI classification
    background_tasks.add_task(classify_lead_with_ai, lead_id, lead.dict())
    
    # Send notification
    background_tasks.add_task(
        send_notification,
        type="new_lead",
        data={"name": lead.firstName, "service": lead.serviceType},
    )
    
    return {
        "id": lead_id,
        "status": "created",
        "message": "Lead created successfully. AI classification in progress.",
    }


@router.get("/")
async def list_leads(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """List all leads with pagination"""
    # TODO: Implement via Prisma client
    return {"leads": [], "total": 0, "skip": skip, "limit": limit}


@router.get("/{lead_id}")
async def get_lead(lead_id: str, db: AsyncSession = Depends(get_db)):
    """Get lead details"""
    # TODO: Implement via Prisma client
    return {"id": lead_id, "status": "not_found"}
