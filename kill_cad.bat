@echo off
echo Fechando processos do CAD...
taskkill /F /T /IM acad.exe >nul 2>&1
exit