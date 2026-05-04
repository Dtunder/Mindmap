@echo off
TITLE DeepMindMap Starter
echo Starting DeepMindMap...

:: Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] node_modules not found. Running the fix script first...
    powershell -ExecutionPolicy Bypass -File .\fix_install.ps1
)

echo [INFO] Launching Development Server...
npm run dev -- --open

pause
