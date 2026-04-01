@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Worker Celery - default
echo ========================================

REM Configuracoes
set WORKER_NAME=worker_default
set QUEUE_NAME=default
set LOG_FILE=logs/celery_logs_default.log
set MAX_RETRIES=5
set RETRY_DELAY=10

REM Criar diretorio de logs se nao existir
if not exist "C:\A1fer\htdocs\a1pro\weba1\logs" mkdir "C:\A1fer\htdocs\a1pro\weba1\logs"

REM Ativar ambiente virtual
cd /d C:\A1fer\htdocs\venv\Scripts
call activate.bat
cd /d C:\A1fer\htdocs\a1pro\weba1

:start_worker
echo [%date% %time%] Iniciando worker %WORKER_NAME%...
echo [%date% %time%] Limpando fila %QUEUE_NAME%...

celery -A weba1 purge -Q %QUEUE_NAME% --force

echo [%date% %time%] Iniciando worker...
celery -A weba1 worker -Q %QUEUE_NAME% -l info -f %LOG_FILE% -n %WORKER_NAME%@%COMPUTERNAME% --concurrency 10 --pool threads --max-tasks-per-child 1000 --time-limit 3600 --soft-time-limit 3000 --autoscale 5,10

REM Se chegou aqui, o worker falhou
echo [%date% %time%] Worker falhou! Tentando reiniciar em %RETRY_DELAY% segundos...
timeout /t %RETRY_DELAY% /nobreak >nul

goto start_worker
