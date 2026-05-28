"""
AQUANTICA AI - Ollama Integration
Usa modelo local via ngrok con API OpenAI-compatible
"""

import httpx
from typing import Dict, List, Optional
from app.config import settings

class OllamaAI:
    """
    AI Assistant usando Ollama via ngrok
    Compatible con API de OpenAI para facilitar integración
    """
    
    def __init__(self):
        self.base_url = settings.AI_BASE_URL
        self.api_key = settings.AI_API_KEY
        self.model_name = settings.AI_MODEL_NAME
        self.available = bool(self.base_url and self.model_name)
        
    async def chat(self, message: str, context_type: str = "public") -> str:
        """Chat con Ollama via API OpenAI-compatible"""
        if not self.available:
            return self._fallback_response(message)
        
        try:
            # Contexto de AQUANTICA para el prompt
            system_prompt = """Eres AURA, el asistente virtual de AQUANTICA, una empresa peruana líder en soluciones integrales de ingeniería, arquitectura y construcción.

SERVICIOS DE AQUANTICA:
1. INGENIERÍA CIVIL - Diseño estructural, cálculo, ingeniería sísmica, proyectos de edificación
2. ARQUITECTURA - Diseño arquitectónico residencial y comercial, interiores, renders 3D
3. CONSTRUCCIÓN - Construcción de edificaciones, remodelaciones, gestión de obra
4. SANEAMIENTO FÍSICO LEGAL - Regularización de inmuebles, licencias, habilitaciones, declaratoria de fábrica, independización de lotes, subdivisiones

UBICACIÓN: Lima, Perú
CONTACTO: WhatsApp 977 498 144
WEB: aquantica-group.com

INSTRUCCIONES:
- Responde de manera profesional y amigable
- Sé conciso pero informativo
- Si no sabes algo específico, sugiere agendar una evaluación gratuita
- Enfócate en servicios de ingeniería, arquitectura, construcción y saneamiento legal
- Puedes hablar de precios aproximados si te preguntan (evaluación gratuita, diseño desde $X, etc.)
- Sugiere contactar por WhatsApp para detalles específicos"""

            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": message}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 500,
                        "stream": False
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"Ollama error: {response.status_code} - {response.text}")
                    return self._fallback_response(message)
                    
        except Exception as e:
            print(f"Ollama connection error: {e}")
            return self._fallback_response(message)
    
    def _fallback_response(self, message: str) -> str:
        """Fallback cuando Ollama no está disponible"""
        msg_lower = message.lower()
        
        if any(word in msg_lower for word in ["hola", "buenos"]):
            return "¡Hola! Soy AURA de AQUANTICA. ¿En qué puedo ayudarte con tus proyectos de ingeniería, arquitectura o construcción?"
        
        if any(word in msg_lower for word in ["precio", "costo", "cotizar"]):
            return "Los precios varían según el proyecto. Ofrecemos evaluación gratuita. ¿Qué servicio te interesa: ingeniería, arquitectura, construcción o saneamiento legal?"
        
        if any(word in msg_lower for word in ["ingeniería", "estructura"]):
            return "Ofrecemos ingeniería civil: diseño estructural, cálculo, ingeniería sísmica. ¿Necesitas evaluación estructural?"
        
        if any(word in msg_lower for word in ["arquitectura", "diseño"]):
            return "Servicios de arquitectura: diseño residencial/comercial, interiores, renders 3D. ¿Tienes un proyecto en mente?"
        
        if any(word in msg_lower for word in ["construcción", "obra"]):
            return "Realizamos construcción de edificaciones, remodelaciones y gestión de obra. ¿Presupuesto o remodelación?"
        
        if any(word in msg_lower for word in ["saneamiento", "regularizar", "licencia"]):
            return "Nos especializamos en saneamiento físico legal: regularización, licencias, declaratoria de fábrica, independización. ¿Qué necesitas regularizar?"
        
        return "Entiendo tu consulta sobre AQUANTICA. Para información precisa, te recomiendo agendar evaluación gratuita al WhatsApp 977 498 144. ¿Sobre qué servicio necesitas ayuda?"
    
    async def classify_lead(self, lead_data: Dict) -> Dict:
        """Clasificar lead usando Ollama"""
        if not self.available:
            return {"classification": "manual_review", "reason": "Ollama not available"}
        
        try:
            prompt = f"""Analiza este lead y clasifícalo:
Nombre: {lead_data.get('name', 'N/A')}
Email: {lead_data.get('email', 'N/A')}
Teléfono: {lead_data.get('phone', 'N/A')}
Mensaje: {lead_data.get('message', 'N/A')}
Servicio de interés: {lead_data.get('service_type', 'General')}

Responde en formato JSON:
{{
    "calidad": 1-100,
    "servicio_probable": "ingenieria|arquitectura|construccion|saneamiento|general",
    "urgencia": "baja|media|alta",
    "siguiente_paso": "llamar|email|whatsapp|evaluacion_gratuita",
    "notas": "observaciones"
}}"""

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model_name,
                        "messages": [
                            {"role": "system", "content": "Eres un experto en clasificación de leads inmobiliarios. Responde solo con JSON válido."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 300
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    # Intentar parsear JSON
                    try:
                        import json
                        return json.loads(content)
                    except:
                        return {"classification": "manual_review", "raw_response": content}
                else:
                    return {"classification": "manual_review", "error": f"HTTP {response.status_code}"}
                    
        except Exception as e:
            return {"classification": "manual_review", "error": str(e)}

# Instancia global
ollama_ai = OllamaAI()

async def chat_with_ollama(message: str, context_type: str = "public") -> str:
    """Función pública para chat con Ollama"""
    return await ollama_ai.chat(message, context_type)

async def classify_lead_with_ollama(lead_data: Dict) -> Dict:
    """Función pública para clasificar leads"""
    return await ollama_ai.classify_lead(lead_data)
