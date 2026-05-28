"""
AQUANTICA AI - Groq Integration (Free tier: 20 req/min)
"""

import httpx
from typing import Dict
from app.config import settings

class GroqAI:
    """AI Assistant usando Groq API (Llama 3.1 8B)"""
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = "llama-3.1-8b-instant"
        self.available = bool(self.api_key)
    
    async def chat(self, message: str, context_type: str = "public") -> str:
        """Chat con Groq API"""
        if not self.available:
            return self._fallback_response(message)
        
        try:
            system_prompt = """Eres AURA, el asistente virtual de AQUANTICA, una empresa peruana líder en soluciones integrales de ingeniería, arquitectura y construcción.

SERVICIOS DE AQUANTICA:
1. INGENIERÍA CIVIL - Diseño estructural, cálculo, ingeniería sísmica, proyectos de edificación
2. ARQUITECTURA - Diseño arquitectónico residencial y comercial, interiores, renders 3D
3. CONSTRUCCIÓN - Construcción de edificaciones, remodelaciones, gestión de obra
4. SANEAMIENTO FÍSICO LEGAL - Regularización de inmuebles, licencias, habilitaciones, declaratoria de fábrica, independización de lotes, subdivisiones

INSTITUCIONES PÚBLICAS DEL PERÚ (Contexto correcto):
- SUNARP (Superintendencia Nacional de los Registros Públicos): Registra la propiedad inmueble en el Perú. Aquí se inscriben las compraventas, independizaciones, subdivisiones, hipotecas, etc. NO es de trabajadores.
- COFOPRI (Comisión de Formalización de la Propiedad Informal): Encargada de formalizar y dar seguridad jurídica a la propiedad de inmuebles en asentamientos humanos y zonas rurales.
- MUNICIPALIDADES: Otorgan licencias de edificación, habilitaciones urbanas, certificados de parámetros urbanísticos.
- SUNAT: Impuestos y tributos relacionados a la propiedad.
- MINCETUR: Licencias de funcionamiento para empresas turísticas.

UBICACIÓN: Lima, Perú
CONTACTO: WhatsApp 977 498 144
WEB: aquantica-group.com

INSTRUCCIONES:
- Responde de manera profesional y amigable en español
- Usa el contexto correcto de instituciones peruanas (SUNARP es de registros públicos/propiedad, no de trabajadores)
- Sé conciso pero informativo (2-3 oraciones)
- Si no sabes algo específico, sugiere agendar evaluación gratuita
- Puedes hablar de precios aproximados si te preguntan
- Siempre termina sugiriendo contactar por WhatsApp para más detalles"""

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": message}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 500
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"Groq error: {response.status_code} - {response.text}")
                    return self._fallback_response(message)
                    
        except Exception as e:
            print(f"Groq error: {e}")
            return self._fallback_response(message)
    
    def _fallback_response(self, message: str) -> str:
        """Fallback cuando Groq no está disponible"""
        msg_lower = message.lower()
        
        if any(word in msg_lower for word in ["hola", "buenos"]):
            return "¡Hola! Soy AURA de AQUANTICA. ¿En qué puedo ayudarte con ingeniería, arquitectura o construcción?"
        
        if any(word in msg_lower for word in ["precio", "costo", "cotizar"]):
            return "Los precios varían según el proyecto. Ofrecemos evaluación gratuita. ¿Qué servicio te interesa: ingeniería, arquitectura, construcción o saneamiento legal? Contacta WhatsApp 977 498 144"
        
        if any(word in msg_lower for word in ["ingeniería", "estructura"]):
            return "Ofrecemos ingeniería civil: diseño estructural, cálculo, ingeniería sísmica. ¿Necesitas evaluación estructural? WhatsApp 977 498 144"
        
        if any(word in msg_lower for word in ["arquitectura", "diseño"]):
            return "Diseño arquitectónico residencial/comercial, interiores, renders 3D. ¿Tienes un proyecto en mente? WhatsApp 977 498 144"
        
        if any(word in msg_lower for word in ["construcción", "obra"]):
            return "Construcción de edificaciones, remodelaciones, gestión de obra. Cotización gratis al WhatsApp 977 498 144"
        
        if any(word in msg_lower for word in ["saneamiento", "regularizar", "licencia"]):
            return "Saneamiento físico legal: regularización, licencias, declaratoria de fábrica, independización. ¿Qué necesitas regularizar? WhatsApp 977 498 144"
        
        return "Entiendo tu consulta sobre AQUANTICA. Para información precisa, agenda evaluación gratuita al WhatsApp 977 498 144. ¿Sobre qué servicio necesitas ayuda?"

groq_ai = GroqAI()

async def chat_with_groq(message: str, context_type: str = "public") -> str:
    """Función pública para chat con Groq"""
    return await groq_ai.chat(message, context_type)
