@echo off
echo ========================================
echo Monitor Celery Workers
echo ========================================

REM Ativar ambiente virtual
cd /d C:\A1fer\htdocs\venv\Scripts
call activate.bat
cd /d C:\A1fer\htdocs\a1pro\weba1

:monitor_loop
echo.
echo [%date% %time%] Verificando status dos workers...
echo.

REM Verificar workers ativos
echo Workers ativos:
celery -A weba1 inspect active

echo.
echo Filas:
celery -A weba1 inspect stats

echo.
echo Aguardando 30 segundos para proxima verificacao...
timeout /t 30 /nobreak >nul

goto monitor_loop
