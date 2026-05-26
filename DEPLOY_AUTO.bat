@echo off
chcp 65001 >nul
echo.
echo 🚀 AQUANTICA PLATFORM - DEPLOY AUTOMATICO
echo ==========================================
echo.

:: Verificar prerequisitos
echo 🔍 Verificando prerequisitos...

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git no está instalado. Descarga desde: https://git-scm.com
    exit /b 1
)

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Vercel CLI no instalado. Instalando...
    call npm i -g vercel
)

where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Railway CLI no instalado. Instalando...
    call npm i -g @railway/cli
)

echo ✅ Prerequisitos listos
echo.

:: Configurar Git si no está configurado
git config --global user.name >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚙️  Configurando Git por primera vez...
    set /p GIT_NAME="Introduce tu nombre para Git: "
    set /p GIT_EMAIL="Introduce tu email para Git: "
    git config --global user.name "%GIT_NAME%"
    git config --global user.email "%GIT_EMAIL%"
)

:: Inicializar repositorio si es necesario
if not exist .git (
    echo 📦 Inicializando repositorio Git...
    git init
    git add .
    git commit -m "Initial commit: AQUANTICA Platform"
)

:: Crear rama develop si no existe
git branch --list | findstr "develop" >nul
if %errorlevel% neq 0 (
    echo 🌿 Creando rama develop...
    git checkout -b develop
    git add .
    git commit -m "Setup: Develop branch created" 2>nul
) else (
    echo 🌿 Cambiando a rama develop...
    git checkout develop
)

:: Configurar remote si no existe
git remote -v >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔗 Configurando remote de GitHub...
    echo.
    echo Por favor, crea el repositorio en GitHub primero:
    echo   https://github.com/new
    echo.
    echo Luego copia la URL del repositorio (ej: https://github.com/tuusuario/AQUANTICAGROUP.git)
    set /p REPO_URL="URL del repositorio: "
    git remote add origin %REPO_URL%
    git push -u origin main 2>nul || echo ⚠️  Push inicial falló, continuar manualmente...
)

:: Push develop a GitHub
echo 📤 Subiendo rama develop a GitHub...
git push -u origin develop 2>nul || echo ⚠️  Push develop requiere autenticación manual

echo.
echo ==========================================
echo ✅ PREPARACION COMPLETADA
echo ==========================================
echo.
echo 📋 PASOS MANUALES REQUERIDOS:
echo.
echo 1. CLERK AUTHENTICATION:
echo    - Ve a https://dashboard.clerk.com
echo    - Copia CLERK_SECRET_KEY (para Railway)
echo    - Copia NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (para Vercel)
echo.
echo 2. RAILWAY - Backend + Database:
echo    - Ve a https://railway.app
echo    - New Project → Provision PostgreSQL
echo    - Espera 1 minuto y copia DATABASE_URL
echo    - Deploy backend: cd apps/api ^&^& railway up
    - Variables a configurar:
echo      DATABASE_URL=...
echo      CLERK_SECRET_KEY=sk_...
echo      AI_PROVIDER=local (o groq/gemini si tienes API key)
echo.
echo 3. VERCEL - Frontend:
echo    - Ve a https://vercel.com
echo    - Importar proyecto desde GitHub
echo    - Variables a configurar:
echo      NEXT_PUBLIC_API_URL=https://tu-api-railway.app
echo      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
echo.
echo 4. FINALIZAR:
echo    - Ejecuta: ./scripts/deploy.sh all
echo    - O manualmente los comandos arriba
echo.
echo 🎯 Si necesitas ayuda con algún paso, dimelo!
echo.
pause
