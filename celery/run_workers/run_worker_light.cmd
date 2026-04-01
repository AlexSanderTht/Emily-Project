@echo off
setlocal EnableExtensions

rem ============================================================
rem run_worker_light.cmd
rem ------------------------------------------------------------
rem Responsável por:
rem 1) Carregar o contexto central do projeto
rem 2) Entrar no diretório do projeto Django
rem 3) Limpar a fila do worker leve
rem 4) Subir o worker leve do Celery
rem ============================================================


rem ============================================================
rem CONTEXTO DE EXECUCAO
rem ============================================================

call "%~dp0EIA1_ENV_CONTEXT.cmd" || goto :error


rem ============================================================
rem PREPARACAO
rem ============================================================

cd /d "%EIA1_PROJ_DIR%"


rem ============================================================
rem LIMPEZA DA FILA
rem ============================================================

"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP%  purge -Q %EIA1_QUEUE_LIGHT% --force


rem ============================================================
rem EXECUCAO DO WORKER
rem ============================================================

"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP% worker -Q %EIA1_QUEUE_LIGHT% ^
  --loglevel=DEBUG ^
  --logfile="%EIA1_WORKER_LIGHT_LOG_FILE%" ^
  -n %EIA1_WORKER_LIGHT_NAME% ^
  --concurrency=50 ^
  -P threads

goto :eof


rem ============================================================
rem TRATAMENTO DE ERRO
rem ============================================================

:error
echo ERRO ao preparar contexto ou iniciar o worker light.
pause
exit /b 1