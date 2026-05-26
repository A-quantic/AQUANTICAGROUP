"""Hybrid AI service - Uses OpenAI if available, otherwise free alternatives"""

from typing import Dict, List, Optional
from app.config import settings

# Import both services
from app.services.ai import (
    chat_with_context as chat_openai,
    analyze_document as analyze_openai,
    classify_lead_with_ai as classify_openai,
)
from app.services.ai_free import (
    chat_with_context_free,
    analyze_document_free,
    classify_lead_with_ai_free,
)


def should_use_openai() -> bool:
    """Check if OpenAI is configured and preferred"""
    return (
        settings.AI_PROVIDER == "openai" 
        and settings.OPENAI_API_KEY 
        and len(settings.OPENAI_API_KEY) > 10
    )


async def chat_with_context(
    message: str,
    session_id: str,
    context_type: str = "public",
    project_context: Optional[Dict] = None,
) -> str:
    """Chat with AURA - uses OpenAI if configured, otherwise free model"""
    if should_use_openai():
        return await chat_openai(message, session_id, context_type, project_context)
    else:
        return await chat_with_context_free(message, session_id, context_type, project_context)


async def analyze_document(file, document_type: Optional[str] = None) -> Dict:
    """Analyze document - uses OpenAI if configured, otherwise free"""
    if should_use_openai():
        return await analyze_openai(file, document_type)
    else:
        return await analyze_document_free(file, document_type)


async def generate_checklist(project_type: str, municipality: Optional[str] = None) -> List[Dict]:
    """Generate checklist - always uses local logic (no AI needed)"""
    from app.services.ai_free import generate_checklist as generate_free
    return await generate_free(project_type, municipality)


async def detect_missing_documents(
    uploaded_docs: List[str],
    project_type: str,
) -> List[str]:
    """Detect missing documents - always uses local logic"""
    from app.services.ai_free import detect_missing_documents as detect_free
    return await detect_free(uploaded_docs, project_type)


async def classify_lead_with_ai(lead_id: str, lead_data: Dict) -> Dict:
    """Classify lead - uses OpenAI if configured, otherwise free"""
    if should_use_openai():
        return await classify_openai(lead_id, lead_data)
    else:
        return await classify_lead_with_ai_free(lead_id, lead_data)
