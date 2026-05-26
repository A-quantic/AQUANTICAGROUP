"""Webhook handlers for external services"""

from fastapi import APIRouter, HTTPException, Request
from typing import Dict

router = APIRouter()


@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    """Handle WhatsApp Business API webhooks"""
    try:
        payload = await request.json()
        
        # Process incoming WhatsApp message
        message = payload.get("messages", [{}])[0]
        
        # TODO: Process with AI and respond
        return {"status": "received", "message_id": message.get("id")}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/n8n")
async def n8n_webhook(request: Request):
    """Handle n8n automation webhooks"""
    try:
        payload = await request.json()
        
        # Process automation triggers
        trigger_type = payload.get("type")
        
        return {"status": "processed", "trigger": trigger_type}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/resend")
async def email_webhook(request: Request):
    """Handle email delivery status"""
    try:
        payload = await request.json()
        
        # Update email status in database
        return {"status": "logged"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
