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
    
    async def chat(self, message: str, context_type: str = "public") -> str:
        """Chat con contexto RAG"""
        if not self.initialized:
            return "El asistente AI está inicializando. Por favor intenta en unos momentos."
        
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
