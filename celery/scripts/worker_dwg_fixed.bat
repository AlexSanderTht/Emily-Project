@echo off
echo Iniciando worker para files_using_dwg...

REM Criar diretorio de logs se nao existir
if not exist "C:\A1fer\htdocs\a1pro\weba1\logs" mkdir "C:\A1fer\htdocs\a1pro\weba1\logs"

REM Ativar ambiente virtual e navegar para o diretorio
cd /d C:\A1fer\htdocs\venv\Scripts
call activate.bat
cd /d C:\A1fer\htdocs\a1pro\weba1

REM Limpar fila e iniciar worker
echo Limpando fila files_using_dwg...
celery -A weba1 purge -Q files_using_dwg --force

echo Iniciando worker para files_using_dwg...
celery -A weba1 worker -Q files_using_dwg -l info -f logs/celery_logs_dwg.log -n worker_files_dwg@%COMPUTERNAME% --concurrency 1 --pool solo --max-tasks-per-child 1000 --time-limit 3600 --soft-time-limit 3000

pause
