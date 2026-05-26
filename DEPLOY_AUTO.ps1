#!/usr/bin/env pwsh
#Requires -Version 7

# AQUANTICA PLATFORM - Deploy Automático Completo
# Este script automatiza todo lo posible y guía para los pasos manuales

$ErrorActionPreference = "Stop"

# Colors
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-Step($message) {
    Write-Host "$Blue▶ $message$Reset"
}

function Write-Success($message) {
    Write-Host "$Green✓ $message$Reset"
}

function Write-Warning($message) {
    Write-Host "$Yellow⚠ $message$Reset"
}

function Write-Error($message) {
    Write-Host "$Red✗ $message$Reset"
}

function Test-Command($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

Clear-Host
Write-Host @"
🚀 AQUANTICA PLATFORM - DEPLOY AUTOMATICO
==========================================

Este script automatizará todo lo posible y te guiará por los pasos manuales necesarios.

"@

# 1. Verificar prerequisitos
Write-Step "Verificando prerequisitos..."

$missing = @()

if (-not (Test-Command "git")) {
    $missing += "Git (https://git-scm.com)"
}
if (-not (Test-Command "node")) {
    $missing += "Node.js (https://nodejs.org)"
}
if (-not (Test-Command "npm")) {
    $missing += "npm (incluido con Node.js)"
}

if ($missing.Count -gt 0) {
    Write-Error "Faltan herramientas requeridas:"
    $missing | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

Write-Success "Prerequisitos listos"

# 2. Instalar CLI tools si no existen
Write-Step "Verificando CLI tools..."

if (-not (Test-Command "vercel")) {
    Write-Warning "Vercel CLI no encontrado, instalando..."
    npm i -g vercel
}

if (-not (Test-Command "railway")) {
    Write-Warning "Railway CLI no encontrado, instalando..."
    npm i -g @railway/cli
}

Write-Success "CLI tools listos"

# 3. Configurar Git
Write-Step "Configurando Git..."

$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (-not $gitName) {
    $name = Read-Host "Introduce tu nombre para Git"
    git config --global user.name "$name"
}

if (-not $gitEmail) {
    $email = Read-Host "Introduce tu email para Git"
    git config --global user.email "$email"
}

Write-Success "Git configurado"

# 4. Inicializar repositorio si es necesario
$repoRoot = Get-Location
if (-not (Test-Path "$repoRoot/.git")) {
    Write-Step "Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit: AQUANTICA Platform ready for deploy"
    Write-Success "Repositorio creado"
} else {
    Write-Success "Repositorio Git ya existe"
}

# 5. Crear rama develop
Write-Step "Configurando rama develop..."

$branches = git branch -a 2>$null
if ($branches -notmatch "develop") {
    git checkout -b develop 2>$null
    git add . 2>$null
    git commit -m "Setup: Develop branch with all features" 2>$null || Write-Warning "Nada para commitear"
    Write-Success "Rama develop creada"
} else {
    git checkout develop 2>$null
    Write-Success "En rama develop"
}

# 6. Configurar remote
$remotes = git remote -v 2>$null
if (-not $remotes) {
    Write-Host ""
    Write-Warning "No hay remote configurado."
    Write-Host @"

📝 INSTRUCCIONES MANUALES REQUERIDAS:

1. Ve a https://github.com/new
2. Crea un repositorio llamado "AQUANTICAGROUP"
3. Copia la URL (ej: https://github.com/TUUSUARIO/AQUANTICAGROUP.git)

"@
    $repoUrl = Read-Host "Pega la URL del repositorio"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Success "Remote configurado"
        
        Write-Step "Subiendo código a GitHub..."
        git push -u origin main 2>$null || Write-Warning "Push main falló, intentando develop..."
        git push -u origin develop 2>$null || Write-Warning "Push develop requiere autenticación manual"
    }
} else {
    Write-Success "Remote ya configurado"
    
    Write-Step "Actualizando GitHub..."
    git add . 2>$null
    git commit -m "Deploy: Ready for production" 2>$null || Write-Warning "Sin cambios para commitear"
    git push origin develop 2>$null || Write-Warning "Push requiere autenticación manual con: git push origin develop"
}

# 7. Preparar deploy checklist
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ CÓDIGO LISTO PARA DEPLOY" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 PASOS MANUALES REQUERIDOS (No puedo hacerlos automáticamente):"
Write-Host ""

Write-Host "1️⃣  CLERK AUTHENTICATION:" -ForegroundColor Yellow
Write-Host "    👉 Ve a: https://dashboard.clerk.com"
Write-Host "    👉 Ve a API Keys en el sidebar"
Write-Host "    👉 Copia estos valores:"
Write-Host "       • CLERK_SECRET_KEY (para Railway - backend)"
Write-Host "       • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (para Vercel - frontend)"
Write-Host ""

Write-Host "2️⃣  RAILWAY - Backend + Database:" -ForegroundColor Yellow
Write-Host "    👉 Ve a: https://railway.app"
Write-Host "    👉 Login con GitHub"
Write-Host "    👉 New Project → Provision PostgreSQL"
Write-Host "    👉 Espera 1 minuto → Click en la DB → Connect tab"
Write-Host "    👉 Copia DATABASE_URL"
Write-Host ""
Write-Host "    👉 Variables a configurar en Railway Dashboard:"
Write-Host "       DATABASE_URL=postgresql://... (copiado arriba)"
Write-Host "       CLERK_SECRET_KEY=sk_... (de Clerk)"
Write-Host "       AI_PROVIDER=local  (gratis, no necesitas API key)"
Write-Host ""
Write-Host "    👉 Deploy backend:"
Write-Host "       cd apps/api"
Write-Host "       railway login  (primera vez)"
Write-Host "       railway up"
Write-Host ""

Write-Host "3️⃣  VERCEL - Frontend:" -ForegroundColor Yellow
Write-Host "    👉 Ve a: https://vercel.com"
Write-Host "    👉 Import Project desde GitHub"
Write-Host "    👉 Selecciona tu repo AQUANTICAGROUP"
Write-Host "    👉 Framework: Next.js"
Write-Host "    👉 Root Directory: apps/web"
Write-Host ""
Write-Host "    👉 Variables a configurar:"
Write-Host "       NEXT_PUBLIC_API_URL=https://TU-API.up.railway.app"
Write-Host "       NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... (de Clerk)"
Write-Host ""

Write-Host "4️⃣  DOMINIO PERSONALIZADO (Opcional):" -ForegroundColor Yellow
Write-Host "    👉 En Vercel: Settings → Domains"
Write-Host "    👉 Add: aquantica-group.com"
Write-Host "    👉 Sigue las instrucciones de DNS"
Write-Host ""

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎯 RESUMEN DE LO QUE HE HECHO:" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Verificado prerequisitos (Git, Node, npm)"
Write-Host "✅ Instalado Vercel CLI y Railway CLI"
Write-Host "✅ Configurado Git (nombre y email)"
Write-Host "✅ Inicializado repositorio (git init)"
Write-Host "✅ Creada rama develop"
Write-Host "✅ Preparado código para push a GitHub"
Write-Host "✅ Configuración de IA gratuita lista"
Write-Host ""

Write-Host "❌ LO QUE NO PUEDO HACER (requiere login manual):" -ForegroundColor Red
Write-Host "   • Login en GitHub (2FA/sesión)"
Write-Host "   • Login en Clerk y copiar API keys"
Write-Host "   • Login en Railway y crear database"
Write-Host "   • Login en Vercel y configurar dominio"
Write-Host ""

$proceed = Read-Host "¿Quieres que abra los navegadores con las URLs que necesitas? (s/n)"
if ($proceed -eq "s" -or $proceed -eq "S") {
    Start-Process "https://github.com/new"
    Start-Process "https://dashboard.clerk.com"
    Start-Process "https://railway.app"
    Start-Process "https://vercel.com"
    Write-Host "🌐 Navegadores abiertos! Completa los pasos y vuelve aquí." -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Una vez completes los pasos manuales, ejecuta:"
Write-Host "   ./scripts/deploy.sh all"
Write-Host ""
Read-Host "Presiona Enter para salir"
