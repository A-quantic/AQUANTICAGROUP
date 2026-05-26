# 🤖 AI GRATUITA - Guía de Configuración

## Opciones de IA Sin Costo

| Proveedor | Modelo | Límite Gratuito | Link |
|-----------|--------|-----------------|------|
| **Groq** | Llama 3.1 8B | 20 requests/min | https://console.groq.com |
| **Google Gemini** | 1.5 Flash | 15 requests/min | https://ai.google.dev |
| **Hugging Face** | Llama 3.2 3B | ~1,000 requests/day | https://huggingface.co/settings/tokens |

---

## 🚀 Opción Recomendada: GROQ (Más rápido)

### Paso 1: Crear cuenta (1 minuto)
1. Ve a https://console.groq.com
2. Sign up con Google/GitHub/email
3. Verifica email

### Paso 2: Obtener API Key (30 segundos)
1. En el dashboard, click **"API Keys"**
2. **Create API Key**
3. Nombre: `AQUANTICA-PROD`
4. Copia la key (empieza con `gsk_`)

### Paso 3: Configurar en Railway
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_tu_clave_aqui
```

---

## 🆓 Opción 2: Google Gemini (Más estable)

### Paso 1: Crear API Key
1. Ve a https://ai.google.dev
2. Click **"Get API key in Google AI Studio"**
3. Create API key
4. Selecciona proyecto o crea nuevo
5. Copia la key

### Paso 2: Configurar
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=tu_clave_aqui
```

---

## 🐢 Opción 3: Hugging Face (Modelos open source)

### Paso 1: Crear token
1. Ve a https://huggingface.co/settings/tokens
2. **New token**
3. Name: `aquantica-api`
4. Role: `read`
5. Copia el token

### Paso 2: Configurar
```env
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_tu_token_aqui
```

---

## 🏠 Opción 4: Ollama (100% local - Sin internet)

Instala modelos localmente en tu servidor. **Sin límites, sin costos, sin internet.**

### Instalación
```bash
# En tu servidor Railway (o local)
curl https://ollama.ai/install.sh | sh

# Descargar modelo
ollama pull llama3.2

# Correr servidor
ollama serve
```

### Configuración
```python
# Modificar ai_free.py para usar Ollama local
OLLAMA_URL = "http://localhost:11434"
```

---

## 📋 Variables de Entorno Completas (Railway)

### Opción A: Con IA Gratuita
```env
# AI Provider (escoge uno)
AI_PROVIDER=groq
GROQ_API_KEY=gsk_tu_clave

# O
AI_PROVIDER=gemini
GEMINI_API_KEY=tu_clave

# O sin IA (fallback local)
AI_PROVIDER=local

# Database (requerido)
DATABASE_URL=postgresql://...

# Auth (requerido)
CLERK_SECRET_KEY=sk_...
```

### Opción B: Sin IA (Respuestas predefinidas)
```env
# Solo desactiva OpenAI
OPENAI_API_KEY=
AI_PROVIDER=local
```

---

## ⚡ Cambios en el Código

El archivo `apps/api/app/services/ai_free.py` ya está configurado. Solo necesitas:

1. Copiar `ai_free.py` a tu proyecto
2. Modificar los routers para usar las funciones `_free`:

```python
# En routers/ai.py
from app.services.ai_free import chat_with_context_free

@router.post("/chat")
async def chat(request: ChatRequest):
    response = await chat_with_context_free(
        message=request.message,
        session_id=request.session_id
    )
    return {"response": response}
```

---

## 🧪 Testing

```bash
# Testear endpoint
curl -X POST https://tu-api.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué es el saneamiento?", "session_id": "test"}'
```

---

## 📊 Comparativa

| Feature | Groq | Gemini | Hugging Face | Ollama |
|---------|------|--------|--------------|--------|
| Velocidad | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡⚡⚡ |
| Estabilidad | ⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Costo | Gratis | Gratis | Gratis | Gratis |
| Setup | Fácil | Fácil | Fácil | Medio |
| Offline | No | No | No | **Sí** |

**Recomendación**: Empieza con **Groq** (rápido y estable), luego migra a **Ollama** si necesitas escalar sin límites.

---

## 🆘 Troubleshooting

### "Rate limit exceeded"
- Espera 1 minuto (se resetea automáticamente)
- Considera usar múltiples providers con fallback

### "Model not available"
- El modelo en Hugging Face está cargando (espera 1-2 minutos)
- Prueba con otro modelo más popular

### Respuestas lentas
- Usa Groq (es el más rápido)
- O instala Ollama localmente

---

## ✅ Checklist

- [ ] Crear cuenta en Groq/Gemini/Hugging Face
- [ ] Obtener API Key
- [ ] Configurar en Railway Dashboard
- [ ] Testear endpoint `/api/ai/chat`
- [ ] Verificar que AURA responde correctamente

**¿Quieres que te guíe paso a paso para crear la cuenta en alguno de estos servicios?**
