# AQUANTICA GROUP - Plataforma de Gestión Inmobiliaria

**Infraestructura digital para gestión y saneamiento inmobiliario en Perú**

![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20PostgreSQL%20%7C%20Clerk-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   apps/web      │     │   apps/admin    │     │   apps/api      │
│  (Next.js 15)   │     │  (Next.js 15)   │     │  (FastAPI)      │
│                 │     │                 │     │                 │
│  • Landing      │     │  • Dashboard    │     │  • Auth         │
│  • Portal       │     │  • CRM          │     │  • AI/AURA      │
│    Cliente      │     │  • Analytics    │     │  • Documentos   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │   packages/database       │
                    │   (Prisma + PostgreSQL)   │
                    └───────────────────────────┘
```

---

## 📁 Estructura del Monorepo

```
aquantica-platform/
├── apps/
│   ├── web/              # Landing + Portal Cliente (Next.js)
│   ├── admin/            # Dashboard Administrativo (Next.js)
│   └── api/              # Backend FastAPI + IA
├── packages/
│   ├── database/         # Prisma schema + client
│   ├── ui/               # Componentes compartidos (ShadCN)
│   ├── config/           # Tailwind + TS configs
│   └── ai/               # LangChain + RAG infra
├── infrastructure/
│   └── docker/           # Docker Compose + configs
└── ai-knowledge-base/    # Documentos vectorizados
    ├── sunarp/
    ├── cofopri/
    ├── municipios/
    └── templates/
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+ (con pgvector)
- Docker (opcional pero recomendado)

### 1. Clonar e instalar

```bash
git clone https://github.com/A-quantic/AQUANTICAGROUP.git
cd AQUANTICAGROUP

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

Variables requeridas:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Auth frontend
- `CLERK_SECRET_KEY` - Auth backend
- `DATABASE_URL` - PostgreSQL connection
- `OPENAI_API_KEY` - Para AURA (IA)
- `PINECONE_API_KEY` - Vector database para RAG

### 3. Iniciar base de datos

**Opción A: Docker (Recomendado)**
```bash
docker-compose up postgres -d
```

**Opción B: PostgreSQL local**
```bash
# Crear base de datos con pgvector extension
```

### 4. Setup base de datos

```bash
# Generar cliente Prisma
cd packages/database
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Seed datos iniciales
npx prisma db seed
```

### 5. Iniciar desarrollo

**Con Docker Compose (todo en uno):**
```bash
docker-compose up
```

**O manualmente:**
```bash
# Terminal 1: Backend
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2: Frontend
cd apps/web
npm run dev
```

La aplicación estará disponible en:
- **Web**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🗄️ Base de Datos

### Schema Prisma

El modelo incluye:
- **Users** - Auth con Clerk (roles: cliente, admin, abogado, arquitecto)
- **Leads** - Captación de prospectos
- **Projects** - Gestión de proyectos inmobiliarios
- **Properties** - Información de predios
- **Expedientes** - Trámites con SUNARP/COFOPRI/Municipalidades
- **Documents** - Almacenamiento + OCR + embeddings
- **AIConversations** - Historial de chats con AURA

### Comandos útiles

```bash
# Ver datos en UI
cd packages/database && npx prisma studio

# Nueva migración
npx prisma migrate dev --name descripcion_cambio

# Deploy en producción
npx prisma migrate deploy
```

---

## 🤖 AURA - IA Especializada

### Capacidades

| Tipo | Función | Endpoint |
|------|---------|----------|
| **Chat Público** | Asistente web para visitantes | `POST /api/ai/chat` |
| **Análisis Documental** | OCR + extracción de datos | `POST /api/ai/analyze-document` |
| **Checklist IA** | Genera lista documentos faltantes | `POST /api/ai/generate-checklist` |
| **Detección Faltantes** | Compara docs vs requisitos | `POST /api/ai/detect-missing` |

### Entrenamiento RAG

Para entrenar AURA con documentos internos:

```bash
cd packages/ai
python scripts/ingest_documents.py \
  --source ../ai-knowledge-base/sunarp \
  --type normativa
```

---

## 📦 Deploy

### Vercel (Frontend)

```bash
cd apps/web
vercel --prod
```

Variables en Vercel:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL` (URL de Railway)

### Railway (Backend)

```bash
cd apps/api
railway login
railway init
railway up
```

Variables en Railway:
- `DATABASE_URL` (Postgres provisionado por Railway)
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `AWS_*` credenciales

---

## 🔒 Seguridad

- **Auth**: Clerk con MFA opcional
- **Roles**: SUPER_ADMIN, ADMIN, ABOGADO, ARQUITECTO, INGENIERO, CLIENT
- **Middleware**: Protección de rutas `/portal/*` y `/api/protected/*`
- **Documentos**: S3 con presigned URLs, acceso por rol
- **API**: Rate limiting en endpoints públicos

---

## 📋 Roadmap

### Fase 1: Fundación ✅
- [x] Monorepo TurboRepo
- [x] Next.js + Tailwind + ShadCN
- [x] FastAPI base
- [x] PostgreSQL + Prisma
- [x] Clerk auth

### Fase 2: Portal Cliente 🔄
- [ ] Dashboard proyectos
- [ ] Subida de documentos
- [ ] Timeline expedientes
- [ ] Notificaciones push

### Fase 3: IA Documental 📅
- [ ] AURA RAG completo
- [ ] OCR Azure/Gemini
- [ ] Análisis automático partidas
- [ ] Generación de checklists

### Fase 4: Admin Enterprise 📅
- [ ] CRM completo
- [ ] Gestión documental
- [ ] Automatizaciones n8n
- [ ] Analytics

---

## 🆘 Soporte

- **Issues**: GitHub Issues
- **Email**: dev@aquantica-group.com
- **WhatsApp**: 977 498 144

---

## 📄 Licencia

Proyecto privado - AQUANTICA GROUP SAC © 2024
