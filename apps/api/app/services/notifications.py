"""Notification services"""

import requests
from app.config import settings


async def send_notification(type: str, data: dict):
    """Send notification via various channels"""
    
    if type == "new_lead":
        # Send to WhatsApp
        await send_whatsapp_notification(
            phone="51977498144",
            message=f"Nuevo lead: {data.get('name')} interesado en {data.get('service')}",
        )
        
        # Send email
        await send_email_notification(
            to="admin@aquantica-group.com",
            subject="Nuevo Lead Recibido",
            body=f"Lead recibido: {data}",
        )
    
    elif type == "expediente_update":
        # Notify client about expediente status change
        pass
    
    elif type == "document_upload":
        # Notify about new document upload
        pass


async def send_whatsapp_notification(phone: str, message: str):
    """Send WhatsApp message via Business API"""
    
    if not settings.WHATSAPP_API_KEY:
        print(f"[MOCK] WhatsApp to {phone}: {message}")
        return True
    
    try:
        # TODO: Implement WhatsApp Business API
        return True
        
    except Exception as e:
        print(f"WhatsApp notification failed: {e}")
        return False


async def send_email_notification(to: str, subject: str, body: str):
    """Send email via Resend"""
    
    try:
        # TODO: Implement Resend API
        print(f"[MOCK] Email to {to}: {subject}")
        return True
        
    except Exception as e:
        print(f"Email notification failed: {e}")
        return False
