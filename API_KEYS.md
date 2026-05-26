# 🔑 GUÍA - Obtener API Keys

## Resumen Rápido

| Servicio | Prioridad | URL para obtener |
|----------|-----------|------------------|
| **Clerk** | ✅ Requerido | https://dashboard.clerk.com |
| **OpenAI** | ✅ Requerido | https://platform.openai.com/api-keys |
| **Railway DB** | ✅ Requerido | Se genera automáticamente en Railway |
| **Pinecone** | ⚠️ Opcional | https://app.pinecone.io |

---

## 1. CLERK (Auth) - Ya deberías tener

### Verificar/obtener keys:
1. Ve a https://dashboard.clerk.com
2. Selecciona tu proyecto
3. Ve a **API Keys** en el sidebar
4. Copia:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (empieza con `pk_`)
   - **Secret key** → `CLERK_SECRET_KEY` (empieza con `sk_`)

---

## 2. OPENAI (AURA AI) - REQUERIDO

### Obtener API Key:
1. Ve a https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Dale nombre: "AQUANTICA-PROD"
4. Copia la key (empieza con `sk-`)
5. **IMPORTANTE**: Guárdala ahora, no se mostrará de nuevo

### Configuración en Railway:
```env
OPENAI_API_KEY=sk-tu_clave_aqui
OPENAI_MODEL=gpt-4o-mini
```

> 💡 **Nota**: `gpt-4o-mini` es más barato para empezar. Puedes cambiar a `gpt-4o` después.

---

## 3. RAILWAY POSTGRES - REQUERIDO

### Crear Database:
1. Ve a https://railway.app/dashboard
2. New Project → **Provision PostgreSQL**
3. Espera a que se cree (1 minuto)
4. Ve a la database → **Connect** tab
5. Copia **Database URL** (formato: `postgresql://postgres:password@...`)

### Configuración:
```env
DATABASE_URL=postgresql://postgres:XXXXXXXX@containers.railway.app:5432/railway
```

---

## 4. PINECONE (Vector DB) - OPCIONAL

Puedes deployar **sin Pinecone** inicialmente. El sistema usará fallback a memoria local.

### Si quieres activar RAG completo:
1. Ve a https://app.pinecone.io
2. Sign up / Sign in
3. Create Index:
   - **Name**: `aquantica`
   - **Dimensions**: `1536`
   - **Metric**: `cosine`
4. Ve a **API Keys** tab
5. Copia tu key

### Configuración:
```env
PINECONE_API_KEY=tu_clave_aqui
PINECONE_INDEX=aquantica
PINECONE_ENVIRONMENT=us-east-1
```

---

## 📝 Resumen de Variables

### Railway (Backend):
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
# Opcionales:
PINECONE_API_KEY=...
```

### Vercel (Frontend):
```env
NEXT_PUBLIC_API_URL=https://api-aquantica.up.railway.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## ⚡ Checklist Rápido

Antes de deployar, asegúrate de tener:

- [ ] Clerk Publishable Key (Vercel)
- [ ] Clerk Secret Key (Railway)
- [ ] OpenAI API Key (Railway)
- [ ] Railway Database URL (Railway)
- [ ] Pinecone API Key (Opcional - Railway)

---

## 🆘 Si no tienes OpenAI

Si no quieres usar OpenAI todavía, puedes deployar con:
- Respuestas simuladas de AURA
- Documentos sin análisis AI
- Chat básico

Y agregar OpenAI después.

**¿Cuál API key necesitas ayuda para obtener?**
