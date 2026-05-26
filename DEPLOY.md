# 🚀 GUÍA DE DEPLOY - AQUANTICA PLATFORM

## Resumen Rápido

| Servicio | Plataforma | URL |
|----------|------------|-----|
| Frontend | Vercel | `https://aquantica-group.com` |
| Backend | Railway | `https://api.aquantica-group.com` |
| Database | Railway Postgres | PostgreSQL 15 + pgvector |

---

## 📋 Prerrequisitos

### 1. Cuentas Necesarias

- [Vercel](https://vercel.com) - Para el frontend
- [Railway](https://railway.app) - Para el backend y database
- [Clerk](https://clerk.dev) - Autenticación (ya deberías tenerla)
- [GitHub](https://github.com) - Repositorio

### 2. Instalar CLI Tools

```bash
# Vercel CLI
npm i -g vercel

# Railway CLI
npm i -g @railway/cli

# Login
vercel login
railway login
```

---

## 🗄️ Paso 1: Database (Railway)

### Crear PostgreSQL con pgvector

```bash
# En Railway dashboard
1. New Project → Provision PostgreSQL
2. Enable pgvector extension (ya viene incluido)
3. Copiar DATABASE_URL
```

### Variables de entorno del database:
```
DATABASE_URL=postgresql://postgres:password@containers.railway.app:5432/railway
```

---

## ⚙️ Paso 2: Backend (Railway)

### Opción A: Deploy Automático (Recomendado)

```bash
# Desde la raíz del proyecto
cd apps/api

# Link to Railway project (primera vez)
railway link

# Deploy
railway up

# Ver logs
railway logs
```

### Opción B: Deploy desde GitHub

1. En Railway dashboard: **New Project**
2. Seleccionar: **Deploy from GitHub repo**
3. Elegir: `A-quantic/AQUANTICAGROUP`
4. Railway detectará automáticamente el `Dockerfile`

### Configurar Variables de Entorno (Railway)

En Railway dashboard → Variables:

```env
# Required
DATABASE_URL=<from_railway_postgres>
CLERK_SECRET_KEY=sk_test_... or sk_live_...

# AI Services (Choose FREE option - no OpenAI required!)
# Option 1: Local fallback (completely free, no API key needed)
AI_PROVIDER=local

# Option 2: Groq (FREE tier: 20 requests/min) - https://console.groq.com
# AI_PROVIDER=groq
# GROQ_API_KEY=gsk_...

# Option 3: Gemini (FREE tier: 15 requests/min) - https://ai.google.dev
# AI_PROVIDER=gemini
# GEMINI_API_KEY=...

# Option 4: Hugging Face (FREE tier: ~1000 requests/day)
# AI_PROVIDER=huggingface
# HUGGINGFACE_API_KEY=hf_...

# Optional: Vector Database (only if you want RAG features)
# PINECONE_API_KEY=...
# PINECONE_INDEX=aquantica

# AWS S3 (Optional - for document storage)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=aquantica-documents
AWS_REGION=us-east-1

# CORS
CORS_ORIGINS=["https://aquantica-group.com", "https://www.aquantica-group.com"]
```

### Verificar Backend

```bash
# Health check
curl https://api.aquantica-group.com/health

# API Docs (Swagger UI)
https://api.aquantica-group.com/docs
```

---

## 🎨 Paso 3: Frontend (Vercel)

### Opción A: Deploy Automático (Recomendado)

```bash
# Desde la raíz del proyecto
./scripts/deploy.sh frontend

# O manualmente:
cd apps/web
vercel --prod
```

### Opción B: Deploy desde GitHub

1. En Vercel dashboard: **Add New Project**
2. Importar: `A-quantic/AQUANTICAGROUP`
3. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Configurar Variables de Entorno (Vercel)

En Vercel dashboard → Settings → Environment Variables:

```env
# Required
NEXT_PUBLIC_API_URL=https://api.aquantica-group.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Optional
NEXT_PUBLIC_APP_URL=https://aquantica-group.com
```

### Configurar Dominio Personalizado

En Vercel dashboard → Settings → Domains:

1. Add domain: `aquantica-group.com`
2. Configurar DNS en tu proveedor de dominio
3. Vercel te dará instrucciones específicas

---

## 🔐 Paso 4: Clerk Configuración

### Allowed Origins (CORS)

En Clerk dashboard → API Keys:

```
http://localhost:3000
https://aquantica-group.com
https://www.aquantica-group.com
https://*.vercel.app (para preview deployments)
```

### Webhook (Opcional)

Para sincronizar usuarios con la base de datos:

1. Clerk dashboard → Webhooks → Add endpoint
2. URL: `https://api.aquantica-group.com/api/auth/webhook/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`

---

## 🧪 Paso 5: Testing Post-Deploy

### Checklist de Verificación

```bash
# 1. Landing page
curl https://aquantica-group.com

# 2. API health
curl https://api.aquantica-group.com/health

# 3. Authentication
# Ir a https://aquantica-group.com/portal
# Iniciar sesión con Clerk

# 4. Probar flujo completo:
# - Crear lead desde landing
# - Iniciar sesión en portal
# - Crear proyecto
# - Subir documento
# - Chat con AURA
```

---

## 📊 Comandos Útiles

### Railway

```bash
# Ver logs en tiempo real
railway logs -f

# Variables de entorno
railway variables

# Escalar (aumentar réplicas)
railway up --service api -n 2

# Base de datos
railway connect postgres
```

### Vercel

```bash
# Deploy preview (no producción)
vercel

# Deploy producción
vercel --prod

# Logs
vercel logs aquantica-group.com

# Dominios
vercel domains add aquantica-group.com
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar DATABASE_URL
railway variables | grep DATABASE_URL

# Test connection
railway connect postgres
# Luego: \dt (listar tablas)
```

### Error: "CORS blocked"

Verificar `CORS_ORIGINS` en Railway incluye el dominio de Vercel.

### Error: "Build failed"

```bash
# Limpiar cache y reintentar
cd apps/web
rm -rf .next node_modules
npm install
vercel --prod
```

---

## 📈 Escala Futura

| Métrica | Plan Actual | Next Step |
|---------|-------------|-----------|
| Usuarios | 0-100 | Hobby tier sufficient |
| 100-1000 | Consider Pro tier |
| API Calls | Default | Monitor with Railway |
| Database | 500MB | Auto-scales |
| Storage | S3 Free tier | Monitor usage |

---

## 🆘 Soporte

| Plataforma | Soporte |
|------------|---------|
| Vercel | [vercel.com/support](https://vercel.com/support) |
| Railway | [railway.app/help](https://docs.railway.app/) |
| Clerk | [clerk.dev/support](https://clerk.dev/support) |

---

**¡Listo para deployar! 🚀**

Ejecuta:
```bash
./scripts/deploy.sh all
```
