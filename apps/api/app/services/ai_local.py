"""
AQUANTICA AI - NLP Local con RAG
Modelo: sentence-transformers + ChromaDB + Phi-2
Totalmente local, no requiere APIs externas
"""

import os
import json
from typing import Dict, List, Optional
from pathlib import Path

# NLP Local imports
try:
    from sentence_transformers import SentenceTransformer
    from chromadb import Client, Settings
    from chromadb.config import Settings as ChromaSettings
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
    NLP_AVAILABLE = True
except ImportError:
    NLP_AVAILABLE = False
    print("⚠️  NLP libraries not available. Install: pip install sentence-transformers chromadb transformers torch")

from app.config import settings

class AquanticaAI:
    """
    AI Assistant completamente local para AQUANTICA
    Usa RAG (Retrieval Augmented Generation) con:
    - Embeddings: sentence-transformers/all-MiniLM-L6-v2
    - Vector DB: ChromaDB (local)
    - LLM: microsoft/phi-2 (2.7B parámetros) o modelo más pequeño
    """
    
    def __init__(self):
        self.embeddings = None
        self.vector_store = None
        self.llm = None
        self.tokenizer = None
        self.model = None
        self.initialized = False
        
        # Contexto de AQUANTICA
        self.aquantica_context = """
AQUANTICA es una empresa peruana líder en soluciones integrales de ingeniería, arquitectura y construcción.

SERVICIOS PRINCIPALES:
1. INGENIERÍA CIVIL
   - Diseño estructural avanzado
   - Cálculo y simulación estructural
   - Ingeniería sísmica
   - Proyectos de edificación

2. ARQUITECTURA
   - Diseño arquitectónico residencial y comercial
   - Diseño de interiores
   - Renders y visualización 3D
   - Gestión de proyectos arquitectónicos

3. CONSTRUCCIÓN
   - Construcción de edificaciones
   - Remodelaciones y ampliaciones
   - Gestión de obra
   - Control de calidad

4. SANEAMIENTO FÍSICO LEGAL
   - Regularización de inmuebles
   - Declaratoria de fábrica
   - Independización de lotes
   - Subdivisiones y lotizaciones
   - Licencias de edificación
   - Habilitaciones urbanas

PROCESO DE TRABAJO:
1. Evaluación gratuita inicial
2. Propuesta técnica y económica
3. Contrato y kickoff
4. Ejecución del proyecto
5. Entrega y post-venta

UBICACIÓN: Lima, Perú
CONTACTO: WhatsApp 977 498 144
WEB: aquantica-group.com

VALORES:
- Excelencia técnica
- Innovación constante
- Compromiso con el cliente
- Sostenibilidad
- Transparencia

SECTORES ATENDIDOS:
- Residencial (casas, departamentos, condominios)
- Comercial (oficinas, locales, centros comerciales)
- Industrial (naves, plantas, almacenes)
- Institucional (colegios, hospitales, iglesias)
"""
        
    async def initialize(self):
        """Inicializar modelo NLP local"""
        if not NLP_AVAILABLE:
            print("❌ NLP libraries not available")
            return False
            
        try:
            print("🚀 Inicializando AQUANTICA AI Local...")
            
            # 1. Cargar modelo de embeddings
            print("📥 Cargando embeddings (sentence-transformers)...")
            self.embeddings = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            
            # 2. Configurar ChromaDB
            print("💾 Configurando ChromaDB...")
            chroma_path = Path("./chroma_db")
            chroma_path.mkdir(exist_ok=True)
            
            client_settings = ChromaSettings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=str(chroma_path)
            )
            self.chroma_client = Client(client_settings)
            
            # Crear o cargar colección
            try:
                self.collection = self.chroma_client.get_collection("aquantica_knowledge")
                print("✅ Colección existente cargada")
            except:
                self.collection = self.chroma_client.create_collection("aquantica_knowledge")
                print("✅ Nueva colección creada")
                await self._index_knowledge_base()
            
            # 3. Cargar LLM pequeño (Phi-2 es ~2.7GB, podría ser pesado para Railway)
            # Usamos un modelo más pequeño: TinyLlama o similar
            print("🧠 Cargando LLM local...")
            
            # Intentar cargar modelo pequeño
            model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # ~600MB
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                model_name, 
                trust_remote_code=True,
                local_files_only=False
            )
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else "cpu",
                trust_remote_code=True,
                local_files_only=False
            )
            
            self.llm = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                max_new_tokens=256,
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )
            
            self.initialized = True
            print("✅ AQUANTICA AI Local inicializado correctamente")
            return True
            
        except Exception as e:
            print(f"❌ Error inicializando AI: {e}")
            return False
    
    async def _index_knowledge_base(self):
        """Indexar conocimiento de Aquantica en ChromaDB"""
        print("📚 Indexando conocimiento de AQUANTICA...")
        
        # Dividir contexto en chunks
        chunks = self._chunk_text(self.aquantica_context, chunk_size=500, overlap=100)
        
        # Generar embeddings y guardar
        for i, chunk in enumerate(chunks):
            embedding = self.embeddings.encode(chunk).tolist()
            self.collection.add(
                embeddings=[embedding],
                documents=[chunk],
                ids=[f"chunk_{i}"],
                metadatas=[{"source": "aquantica_context", "chunk": i}]
            )
        
        print(f"✅ {len(chunks)} chunks indexados")
    
    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
        """Dividir texto en chunks superpuestos"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    def _rule_based_response(self, message: str) -> str:
        """
        Sistema de respuestas basado en reglas (fallback cuando LLM no está disponible)
        Analiza palabras clave y devuelve respuestas relevantes de AQUANTICA
        """
        msg_lower = message.lower()
        
        # Detectar intención por palabras clave
        if any(word in msg_lower for word in ["hola", "buenos días", "buenas tardes", "saludos"]):
            return "¡Hola! Soy AURA, el asistente virtual de AQUANTICA. ¿En qué puedo ayudarte hoy con tus proyectos de ingeniería, arquitectura o construcción?"
        
        if any(word in msg_lower for word in ["precio", "costo", "cuánto cuesta", "tarifa", "cotizar", "cotización"]):
            return "Los precios varían según el proyecto. Ofrecemos evaluación gratuita para darte una cotización precisa. ¿Qué tipo de proyecto necesitas? Podemos cotizar: diseño arquitectónico, ingeniería civil, construcción, o saneamiento legal."
        
        if any(word in msg_lower for word in ["ingeniería", "estructura", "cálculo", "cimentación", "sismo", "losas", "columnas"]):
            return "En AQUANTICA contamos con ingenieros civiles especializados en diseño estructural, cálculo y simulación estructural, ingeniería sísmica y proyectos de edificación. ¿Necesitas una evaluación estructural para tu proyecto?"
        
        if any(word in msg_lower for word in ["arquitectura", "diseño", "plano", "render", "fachada", "interior", "fachada"]):
            return "Ofrecemos servicios de arquitectura: diseño arquitectónico residencial y comercial, diseño de interiores, renders y visualización 3D, y gestión de proyectos arquitectónicos. ¿Tienes un proyecto en mente? Podemos ayudarte desde el concepto hasta la construcción."
        
        if any(word in msg_lower for word in ["construcción", "construir", "obra", "edificar", "remodelar", "ampliar", "reforma"]):
            return "Realizamos construcción de edificaciones, remodelaciones, ampliaciones, gestión de obra y control de calidad. Trabajamos en proyectos residenciales, comerciales e industriales. ¿Quieres iniciar una obra o remodelar un espacio existente?"
        
        if any(word in msg_lower for word in ["saneamiento", "regularizar", "licencia", "habilitación", "declaratoria", "independizar", "subdividir", "municipal", "municipalidad"]):
            return "En AQUANTICA nos especializamos en saneamiento físico legal: regularización de inmuebles, declaratoria de fábrica, independización de lotes, subdivisiones, lotizaciones, licencias de edificación y habilitaciones urbanas. ¿Necesitas regularizar tu propiedad? Te ayudamos con todo el proceso municipal."
        
        if any(word in msg_lower for word in ["tiempo", "duración", "cuánto demora", "plazo", "cuándo", "fecha"]):
            return "Los plazos dependen del tipo y complejidad del proyecto. Una evaluación inicial toma 1-2 días, diseño arquitectónico 2-4 semanas, y proyectos de construcción varían según el tamaño. ¿Tienes un proyecto específico? Podemos darte un cronograma estimado en la evaluación gratuita."
        
        if any(word in msg_lower for word in ["contacto", "teléfono", "whatsapp", "email", "correo", "llamar", "ubicación", "dónde están", "dirección"]):
            return "Puedes contactarnos por WhatsApp al 977 498 144 o visitar nuestra web aquantica-group.com. Estamos en Lima, Perú. ¿Prefieres que te contactemos nosotros? Déjanos tus datos y un asesor te escribirá."
        
        if any(word in msg_lower for word in ["proyecto", "servicio", "qué hacen", "actividades", "trabajos"]):
            return "AQUANTICA ofrece 4 líneas de servicio: 1) Ingeniería Civil (estructuras, cálculo, sismo), 2) Arquitectura (diseño, renders, planos), 3) Construcción (obras, remodelaciones, gestión), 4) Saneamiento Legal (regularización, licencias, municipalidades). ¿Cuál te interesa?"
        
        if any(word in msg_lower for word in ["gracias", "thank", "ok", "perfecto", "bien", "excelente"]):
            return "¡De nada! Estamos aquí para ayudarte. Si tienes más preguntas sobre nuestros servicios de ingeniería, arquitectura, construcción o saneamiento legal, no dudes en consultar. ¿Te gustaría agendar una evaluación gratuita con uno de nuestros especialistas?"
        
        if any(word in msg_lower for word in ["adiós", "chau", "hasta luego", "nos vemos", "bye"]):
            return "¡Hasta luego! Gracias por contactar a AQUANTICA. Si necesitas ayuda con proyectos de ingeniería, arquitectura, construcción o saneamiento legal, estamos a tu disposición. ¡Que tengas un excelente día!"
        
        # Respuesta por defecto (cuando no detecta intención específica)
        return f"Entiendo que estás interesado en nuestros servicios. En AQUANTICA ofrecemos soluciones integrales de ingeniería, arquitectura, construcción y saneamiento legal en Lima, Perú. Para darte información precisa sobre tu caso específico, te recomiendo agendar una evaluación gratuita con uno de nuestros especialistas. ¿Te gustaría que te contactemos por WhatsApp al 977 498 144 o prefieres dejarnos tus datos para que un asesor te escriba?"
    
    async def chat(self, message: str, context_type: str = "public") -> str:
        """Chat con contexto RAG o fallback basado en reglas"""
        # Si no está inicializado con LLM, usar respuestas basadas en reglas
        if not self.initialized:
            return self._rule_based_response(message)
        
        try:
            # 1. Buscar contexto relevante
            query_embedding = self.embeddings.encode(message).tolist()
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=3
            )
            
            # 2. Construir contexto
            relevant_context = "\n\n".join(results['documents'][0]) if results['documents'] else ""
            
            # 3. Construir prompt
            system_prompt = f"""Eres AURA, el asistente virtual de AQUANTICA, una empresa de ingeniería, arquitectura y construcción en Lima, Perú.

INFORMACIÓN RELEVANTE:
{relevant_context}

INSTRUCCIONES:
- Responde de manera profesional y amigable
- Usa solo la información proporcionada arriba
- Si no sabes algo, sugiere contactar por WhatsApp: 977 498 144
- Sé conciso pero completo
- Enfócate en servicios de ingeniería, arquitectura, construcción y saneamiento legal
- Sugiere agendar una evaluación gratuita cuando sea apropiado"""

            # 4. Generar respuesta con LLM
            prompt = f"<|system|>\n{system_prompt}</s>\n<|user|>\n{message}</s>\n<|assistant|>\n"
            
            response = self.llm(prompt, return_full_text=False)[0]['generated_text']
            
            # Limpiar respuesta
            response = response.split("</s>")[0].strip()
            
            return response
            
        except Exception as e:
            print(f"❌ Error en chat: {e}")
            return f"Lo siento, ocurrió un error. Por favor contactanos por WhatsApp: 977 498 144. Error: {str(e)[:100]}"
    
    async def classify_lead(self, lead_data: Dict) -> Dict:
        """Clasificar lead con análisis local"""
        if not self.initialized:
            return {
                "lead_id": lead_data.get("id", "unknown"),
                "classification": "manual_review",
                "score": 50,
                "reason": "AI no inicializada",
                "service_suggestion": "General"
            }
        
        try:
            # Análisis simple basado en palabras clave
            message = f"{lead_data.get('message', '')} {lead_data.get('service_type', '')}"
            message_lower = message.lower()
            
            # Keywords para servicios
            services = {
                "ingenieria_civil": ["estructura", "cálculo", "sismo", "cimentación", "losas"],
                "arquitectura": ["diseño", "render", "plano", "fachada", "interior"],
                "construccion": ["construir", "obra", "edificar", "remodelar", "ampliar"],
                "saneamiento": ["regularizar", "licencia", "habilitación", "declaratoria", "independizar"]
            }
            
            # Detectar servicio principal
            service_scores = {}
            for service, keywords in services.items():
                score = sum(1 for kw in keywords if kw in message_lower)
                service_scores[service] = score
            
            main_service = max(service_scores, key=service_scores.get)
            
            # Calcular calidad del lead
            quality_score = 50
            if lead_data.get("phone"):
                quality_score += 15
            if lead_data.get("email"):
                quality_score += 10
            if len(message) > 100:
                quality_score += 15
            if any(word in message_lower for word in ["urgente", "pronto", "inmediato", "ya"]):
                quality_score += 10
            
            return {
                "lead_id": lead_data.get("id", "unknown"),
                "classification": "auto_classified",
                "score": min(quality_score, 100),
                "service_suggestion": main_service,
                "urgency": "alta" if quality_score > 80 else "media" if quality_score > 60 else "baja",
                "keywords_detected": service_scores,
                "next_action": "contactar_para_evaluacion" if quality_score > 70 else "seguimiento_email"
            }
            
        except Exception as e:
            return {
                "lead_id": lead_data.get("id", "unknown"),
                "classification": "error",
                "error": str(e),
                "score": 50
            }

# Instancia global
ai_local = AquanticaAI()

async def initialize_ai():
    """Inicializar AI al arrancar servidor"""
    return await ai_local.initialize()

async def chat_with_ai(message: str, context_type: str = "public") -> str:
    """Función pública para chat"""
    return await ai_local.chat(message, context_type)

async def classify_lead_ai(lead_data: Dict) -> Dict:
    """Función pública para clasificar leads"""
    return await ai_local.classify_lead(lead_data)
