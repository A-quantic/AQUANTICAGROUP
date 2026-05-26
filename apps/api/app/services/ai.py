"""AI services for AQUANTICA"""

import os
from typing import Dict, List, Optional
import openai
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

from app.config import settings

# Initialize clients
openai.api_key = settings.OPENAI_API_KEY
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
llm = ChatOpenAI(
    model=settings.OPENAI_MODEL,
    api_key=settings.OPENAI_API_KEY,
    temperature=0.2,
)

# Initialize Pinecone
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
vector_store = None

if settings.PINECONE_INDEX:
    try:
        index = pc.Index(settings.PINECONE_INDEX)
        vector_store = PineconeVectorStore(
            index=index,
            embedding=embeddings,
            namespace="aquantica",
        )
    except Exception as e:
        print(f"Pinecone initialization failed: {e}")


async def chat_with_context(
    message: str,
    session_id: str,
    context_type: str = "public",
    project_context: Optional[Dict] = None,
) -> str:
    """Chat with AURA AI assistant"""
    
    system_prompt = """Eres AURA, el asistente virtual especializado de AQUANTICA GROUP.
    
Tu expertise es:
- Saneamiento físico legal de propiedades en Perú
- Trámites SUNARP (inscripción, actualización de partidas)
- COFOPRI (titulación, formalización de predios)
- Municipalidades (licencias, declaratorias de fábrica)
- Independización y subdivisión de predios
- Normativa inmobiliaria peruana

Reglas:
1. Responde siempre en español
2. Sé profesional pero cercano
3. Si no tienes información específica, sugiere contactar a un especialista
4. NO hagas promesas legales definitivas, usa lenguaje como "generalmente", "típicamente"
5. Para casos complejos, sugiere agendar una evaluación gratuita

Responde de manera concisa y útil."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message},
    ]
    
    try:
        response = await openai.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=500,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Lo siento, hubo un error procesando tu consulta. Por favor intenta de nuevo o contactanos por WhatsApp. Error: {str(e)}"


async def analyze_document(file, document_type: Optional[str] = None) -> Dict:
    """Analyze uploaded document with AI"""
    
    # Placeholder for document analysis
    # In production, this would:
    # 1. Extract text via OCR (Azure Document Intelligence)
    # 2. Analyze with GPT-4 Vision
    # 3. Extract structured data
    
    return {
        "extracted_text": "Texto extraído del documento...",
        "document_type": document_type or "OTROS",
        "confidence": 0.85,
        "extracted_data": {
            "owner_name": None,
            "property_address": None,
            "registration_number": None,
        },
        "summary": "Resumen del documento generado por IA...",
        "missing_fields": ["firma", "fecha"],
    }


async def generate_checklist(project_type: str, municipality: Optional[str] = None) -> List[Dict]:
    """Generate document checklist based on project type"""
    
    checklists = {
        "SANEAMIENTO": [
            {"name": "DNI del propietario", "required": True, "category": "IDENTIDAD"},
            {"name": "Partida registral actualizada", "required": True, "category": "REGISTRO"},
            {"name": "Recibo de agua/luz/luz", "required": True, "category": "SERVICIOS"},
            {"name": "Plano de ubicación", "required": True, "category": "PLANOS"},
            {"name": "Declaración jurada", "required": True, "category": "DECLARACIONES"},
            {"name": "Certificado de parámetros urbanísticos", "required": False, "category": "MUNICIPAL"},
        ],
        "INDEPENDIZACION": [
            {"name": "Copia literal de partida madre", "required": True, "category": "REGISTRO"},
            {"name": "Planos aprobados por municipalidad", "required": True, "category": "PLANOS"},
            {"name": "Certificado de parámetros urbanísticos", "required": True, "category": "MUNICIPAL"},
            {"name": "Pago de tasas SUNARP", "required": True, "category": "TASAS"},
        ],
    }
    
    return checklists.get(project_type, [])


async def detect_missing_documents(
    uploaded_docs: List[str],
    project_type: str,
) -> List[str]:
    """Detect missing documents from checklist"""
    
    checklist = await generate_checklist(project_type)
    required_docs = [item["name"] for item in checklist if item["required"]]
    
    missing = []
    for doc in required_docs:
        # Simple matching (in production, use fuzzy matching)
        if not any(doc.lower() in uploaded.lower() for uploaded in uploaded_docs):
            missing.append(doc)
    
    return missing


async def classify_lead_with_ai(lead_id: str, lead_data: Dict) -> Dict:
    """Classify lead quality and suggest next steps using AI"""
    
    prompt = f"""Analiza este lead para AQUANTICA:

Nombre: {lead_data.get('firstName', '')} {lead_data.get('lastName', '')}
Email: {lead_data.get('email', '')}
Teléfono: {lead_data.get('phone', '')}
Servicio de interés: {lead_data.get('serviceType', '')}
Mensaje: {lead_data.get('message', '')}

Clasifica:
1. Calidad del lead (1-100)
2. Servicio más probable
3. Urgencia estimada (baja/media/alta)
4. Sugerencias de seguimiento

Responde en formato JSON."""

    try:
        response = await openai.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "Eres un experto en clasificación de leads inmobiliarios."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        
        return {
            "leadId": lead_id,
            "classification": response.choices[0].message.content,
            "processedAt": "2024-01-01T00:00:00Z",
        }
    except Exception as e:
        return {
            "leadId": lead_id,
            "error": str(e),
            "classification": None,
        }
