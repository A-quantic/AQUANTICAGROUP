"""Auth API endpoints - Clerk webhook handling"""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict

router = APIRouter()


@router.post("/webhook/clerk")
async def clerk_webhook(request: Request):
    """Handle Clerk webhooks for user sync"""
    try:
        payload = await request.json()
        event_type = payload.get("type")
        
        if event_type == "user.created":
            # Create user in database
            user_data = payload.get("data", {})
            # TODO: Sync with Prisma database
            return {"status": "user_created", "clerk_id": user_data.get("id")}
            
        elif event_type == "user.updated":
            # Update user in database
            user_data = payload.get("data", {})
            return {"status": "user_updated", "clerk_id": user_data.get("id")}
            
        elif event_type == "user.deleted":
            # Soft delete user
            user_data = payload.get("data", {})
            return {"status": "user_deleted", "clerk_id": user_data.get("id")}
            
        return {"status": "ignored", "event": event_type}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me")
async def get_current_user():
    """Get current user profile"""
    return {
        "id": "placeholder",
        "role": "CLIENT",
        "profile": {},
    }
