@echo off
echo Iniciando worker para default...

REM Criar diretorio de logs se nao existir
if not exist "C:\A1fer\htdocs\a1pro\weba1\logs" mkdir "C:\A1fer\htdocs\a1pro\weba1\logs"

REM Ativar ambiente virtual e navegar para o diretorio
cd /d C:\A1fer\htdocs\venv\Scripts
call activate.bat
cd /d C:\A1fer\htdocs\a1pro\weba1

REM Limpar fila e iniciar worker
echo Limpando fila default...
celery -A weba1 purge -Q default --force

echo Iniciando worker para default...
celery -A weba1 worker -Q default -l info -f logs/celery_logs_default.log -n worker_default@%COMPUTERNAME% --concurrency 10 --pool threads --max-tasks-per-child 1000 --time-limit 3600 --soft-time-limit 3000

pause
