@echo off
echo ========================================
echo Parando Workers Celery
echo ========================================

REM Ativar ambiente virtual
cd /d C:\A1fer\htdocs\venv\Scripts
call activate.bat
cd /d C:\A1fer\htdocs\a1pro\weba1

echo Parando todos os workers...
celery -A weba1 control shutdown

echo.
echo Aguardando workers pararem...
timeout /t 5 /nobreak >nul

echo Verificando se ainda ha workers ativos...
celery -A weba1 inspect active

echo.
echo Workers parados!
pause
