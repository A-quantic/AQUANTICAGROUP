"""AI services using FREE models - No OpenAI required"""

import os
import json
import aiohttp
from typing import Dict, List, Optional
from app.config import settings

# Configuration for free AI providers
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# Default free models
DEFAULT_FREE_MODELS = {
    "huggingface": "meta-llama/Llama-3.2-3B-Instruct",  # Free tier
    "groq": "llama-3.1-8b-instant",  # Free tier: 20 requests/min
    "gemini": "gemini-1.5-flash",  # Free tier: 15 requests/min
}

# AURA System Prompt - Respuestas breves por defecto
AURA_SYSTEM_PROMPT = """Eres AURA, el asistente virtual especializado de AQUANTICA GROUP.

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


class FreeAIService:
    """AI service using free/self-hosted models"""
    
    def __init__(self, provider: str = "groq"):
        self.provider = provider
        self.api_keys = {
            "huggingface": os.getenv("HUGGINGFACE_API_KEY", ""),
            "groq": os.getenv("GROQ_API_KEY", ""),
            "gemini": os.getenv("GEMINI_API_KEY", ""),
        }
    
    async def chat(self, message: str, temperature: float = 0.3) -> str:
        """Chat with free AI model"""
        
        if self.provider == "groq" and self.api_keys["groq"]:
            return await self._chat_groq(message, temperature)
        elif self.provider == "gemini" and self.api_keys["gemini"]:
            return await self._chat_gemini(message, temperature)
        elif self.provider == "huggingface" and self.api_keys["huggingface"]:
            return await self._chat_huggingface(message, temperature)
        else:
            # Fallback: local responses without AI
            return self._local_response(message)
    
    async def _chat_groq(self, message: str, temperature: float) -> str:
        """Use Groq API (free tier: 20 req/min)"""
        try:
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Authorization": f"Bearer {self.api_keys['groq']}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": DEFAULT_FREE_MODELS["groq"],
                    "messages": [
                        {"role": "system", "content": AURA_SYSTEM_PROMPT},
                        {"role": "user", "content": message}
                    ],
                    "temperature": temperature,
                    "max_tokens": 500
                }
                
                async with session.post(
                    GROQ_API_URL,
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data["choices"][0]["message"]["content"]
                    else:
                        error_text = await response.text()
                        print(f"Groq API error: {error_text}")
                        return self._local_response(message)
        except Exception as e:
            print(f"Groq error: {e}")
            return self._local_response(message)
    
    async def _chat_gemini(self, message: str, temperature: float) -> str:
        """Use Google Gemini API (free tier: 15 req/min)"""
        try:
            api_key = self.api_keys["gemini"]
            url = f"{GEMINI_API_URL}/{DEFAULT_FREE_MODELS['gemini']}:generateContent?key={api_key}"
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": AURA_SYSTEM_PROMPT + "\n\nUsuario: " + message}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": 500
                    }
                }
                
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"]
                    else:
                        error_text = await response.text()
                        print(f"Gemini API error: {error_text}")
                        return self._local_response(message)
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._local_response(message)
    
    async def _chat_huggingface(self, message: str, temperature: float) -> str:
        """Use Hugging Face Inference API"""
        try:
            model = DEFAULT_FREE_MODELS["huggingface"]
            api_url = f"{HUGGINGFACE_API_URL}{model}"
            
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Authorization": f"Bearer {self.api_keys['huggingface']}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "inputs": f"<|system|>\n{AURA_SYSTEM_PROMPT}\n<|user|>\n{message}\n<|assistant|>\n",
                    "parameters": {
                        "temperature": temperature,
                        "max_new_tokens": 500,
                        "return_full_text": False
                    }
                }
                
                async with session.post(
                    api_url,
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if isinstance(data, list) and len(data) > 0:
                            return data[0].get("generated_text", "")
                        return str(data)
                    else:
                        return self._local_response(message)
        except Exception as e:
            print(f"HuggingFace error: {e}")
            return self._local_response(message)
    
    def _local_response(self, message: str) -> str:
        """Fallback responses when no AI API is available"""
        
        message_lower = message.lower()
        
        # Knowledge base responses
        responses = {
            "saneamiento": """El **saneamiento físico legal** es el proceso de regularizar una propiedad que tiene problemas en su inscripción registral o situación física.

**Tiempo estimado:** 3-6 meses
**Requisitos principales:**
- DNI del propietario
- Partida registral actualizada
- Recibos de servicios
- Planos (si aplica)

¿Te gustaría agendar una **evaluación gratuita** de tu caso?""",
            
            "independizar": """Para **independizar** un inmueble necesitas:

1. **Partida madre** actualizada (copia literal)
2. **Planos aprobados** por la municipalidad
3. **Certificado de parámetros urbanísticos**
4. **Pago de tasas** SUNARP

El proceso toma aproximadamente **2-4 meses**.

¿Tienes ya la partida registral del inmueble principal?""",
            
            "sunarp": """**SUNARP** (Superintendencia Nacional de los Registros Públicos) es donde se inscriben todos los bienes inmuebles en Perú.

**Trámites comunes:**
- Inscripción de propiedad
- Actualización de partidas
- Transferencia de dominio
- Anotaciones preventivas

¿Necesitas ayuda con algún trámite específico en SUNARP?""",
            
            "cofopri": """**COFOPRI** formaliza predios en asentamientos humanos.

**Requisitos:**
- Título de propiedad o posesión
- Croquis de ubicación
- Recibo de luz/agua
- DNI del poseedor

**Tiempo:** 6-12 meses (depende de la zona)

¿Tu propiedad está en un asentamiento humano?""",
            
            "precio": """Los precios varían según el tipo de trámite:

**Estimados:**
- Saneamiento simple: S/ 2,500 - 4,500
- Independización: S/ 3,500 - 6,000
- COFOPRI: S/ 2,000 - 4,000

Para un presupuesto **exacto y sin compromiso**, necesito evaluar tu caso específico. ¿Agendamos una llamada?""",
            
            "tiempo": """**Tiempos estimados:**

| Trámite | Tiempo |
|---------|--------|
| Saneamiento | 3-6 meses |
| Independización | 2-4 meses |
| COFOPRI | 6-12 meses |
| Inscripción SUNARP | 1-3 meses |

*Los tiempos pueden variar según la complejidad del caso.*

¿Quieres que revise tu caso específico?""",
        }
        
        # Check for keywords
        for keyword, response in responses.items():
            if keyword in message_lower:
                return response
        
        # Default response
        return """¡Hola! Soy **AURA**, asistente virtual de AQUANTICA.

Puedo ayudarte con información sobre:
✓ Saneamiento físico legal
✓ Independización de predios
✓ Trámites SUNARP y COFOPRI
✓ Licencias municipales

**Para casos específicos**, te recomiendo:
- 📱 WhatsApp: 977 498 144
- 📧 Email: hola@aquantica-group.com

¿Sobre qué trámite necesitas información?"""


# Global instance
ai_service = FreeAIService(provider=os.getenv("AI_PROVIDER", "groq"))


# Public API functions
async def chat_with_context_free(
    message: str,
    session_id: str,
    context_type: str = "public",
    project_context: Optional[Dict] = None,
) -> str:
    """Chat with AURA using free AI models"""
    return await ai_service.chat(message)


async def analyze_document_free(file, document_type: Optional[str] = None) -> Dict:
    """Analyze document without OpenAI"""
    # Basic analysis without AI
    return {
        "extracted_text": "",
        "document_type": document_type or "OTROS",
        "confidence": 0.5,
        "extracted_data": {},
        "summary": "Análisis de documento - Requiere revisión manual",
        "missing_fields": [],
    }


async def classify_lead_with_ai_free(lead_id: str, lead_data: Dict) -> Dict:
    """Classify lead using simple rules (no AI required)"""
    
    # Simple rule-based classification
    score = 50
    service_type = lead_data.get("serviceType", "CONSULTA_GENERAL")
    message = lead_data.get("message", "")
    
    # Boost score for specific signals
    if "urgente" in message.lower() or "prisa" in message.lower():
        score += 20
    if lead_data.get("phone") and lead_data.get("email"):
        score += 15
    if service_type in ["SANEAMIENTO", "INDEPENDIZACION"]:
        score += 10
    
    return {
        "leadId": lead_id,
        "classification": {
            "quality_score": min(score, 100),
            "service": service_type,
            "urgency": "alta" if score > 70 else "media" if score > 50 else "baja",
            "follow_up": "Contactar dentro de 24 horas" if score > 60 else "Contactar dentro de 48 horas",
        },
        "processedAt": "2024-01-01T00:00:00Z",
    }
