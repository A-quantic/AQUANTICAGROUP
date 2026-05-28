"""AI services for AQUANTICA"""

import os
from typing import Dict, List, Optional

from app.config import settings

# Lazy initialization - clients created on first use
_embeddings = None
_llm = None
_pc = None
_vector_store = None

def _get_openai_embeddings():
    global _embeddings
    if _embeddings is None and settings.OPENAI_API_KEY:
        from langchain_openai import OpenAIEmbeddings
        _embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
    return _embeddings

def _get_llm():
    global _llm
    if _llm is None and settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        _llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.2,
        )
    return _llm

def _get_pinecone():
    global _pc
    if _pc is None and settings.PINECONE_API_KEY:
        from pinecone import Pinecone
        _pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    return _pc

def _get_vector_store():
    global _vector_store
    if _vector_store is None and settings.PINECONE_API_KEY and settings.PINECONE_INDEX:
        try:
            from langchain_pinecone import PineconeVectorStore
            pc = _get_pinecone()
            if pc and settings.PINECONE_INDEX:
                index = pc.Index(settings.PINECONE_INDEX)
                embeddings = _get_openai_embeddings()
                if embeddings:
                    _vector_store = PineconeVectorStore(
                        index=index,
                        embedding=embeddings,
                        namespace="aquantica",
                    )
        except Exception as e:
            print(f"Pinecone initialization failed: {e}")
    return _vector_store


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

REGLAS DE RESPUESTA:
1. Responde SIEMPRE en español
2. SÉ BREVE y DIRECTO por defecto - máximo 2-3 oraciones
3. Si el usuario pide más detalles, información compleja o casos específicos, ENTONCES expande la respuesta
4. NO saludes ni te despidas extensamente - ve directo al punto
5. Usa lenguaje profesional pero cercano
6. Si no tienes información específica, sugiere contactar a un especialista
7. NO hagas promesas legales definitivas, usa "generalmente", "típicamente"
8. Para casos complejos, sugiere agendar evaluación gratuita

Ejemplo respuesta corta: "El saneamiento físico legal regulariza propiedades sin título. Incluye SUNARP, COFOPRI y municipalidades. ¿Te gustaría una evaluación de tu caso específico?"
Ejemplo respuesta larga (solo si se solicita): La que sea necesaria con detalles completos."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message},
    ]
    
    try:
        if not settings.OPENAI_API_KEY:
            return "Servicio de IA temporalmente no disponible. Por favor contactanos por WhatsApp o email."
        
        import openai
        openai.api_key = settings.OPENAI_API_KEY
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
        if not settings.OPENAI_API_KEY:
            return {
                "leadId": lead_id,
                "classification": '{"calidad": 50, "servicio": "General", "urgencia": "media", "sugerencias": "Contactar para evaluación"}',
                "processedAt": "2024-01-01T00:00:00Z",
                "note": "IA no configurada - clasificación manual requerida"
            }
        
        import openai
        openai.api_key = settings.OPENAI_API_KEY
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
