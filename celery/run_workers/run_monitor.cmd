@echo off
setlocal EnableExtensions

rem ============================================================
rem run_monitor.cmd
rem ------------------------------------------------------------
rem Responsável por:
rem 1) Carregar o contexto central do projeto
rem 2) Entrar no diretório do projeto Django
rem 3) Exibir um monitor simples do Celery em loop
rem 4) Atualizar a tela conforme EIA1_REFRESH_SECONDS
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
rem MONITORAMENTO DO CELERY
rem ------------------------------------------------------------
rem Observacao:
rem O loop abaixo atualiza continuamente o estado do Celery.
rem Para encerrar, basta fechar a janela ou pressionar Ctrl+C.
rem ============================================================

:monitor_loop
cls
echo ============================================================
echo MONITOR CELERY
echo ============================================================
echo Ambiente........: %EIA1_PROJECT_ENV%
echo Projeto.........: %EIA1_PROJ_DIR%
echo App Celery......: %EIA1_CELERY_APP%
echo Refresh.........: %EIA1_REFRESH_SECONDS%s
echo Data/Hora.......: %date% %time%
echo ============================================================
echo.

echo -------------------- STATUS / PING -------------------------
"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP% inspect ping -t 3

echo.
echo -------------------- TASKS ATIVAS --------------------------
"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP% inspect active -t 3

echo.
echo -------------------- TASKS RESERVADAS ----------------------
"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP% inspect reserved -t 3

echo.
echo -------------------- TASKS AGENDADAS -----------------------
"%EIA1_VENV_PYTHON_EXE%" -m celery -A %EIA1_CELERY_APP% inspect scheduled -t 3

echo.
echo Atualizando novamente em %EIA1_REFRESH_SECONDS% segundo(s)...
timeout /t %EIA1_REFRESH_SECONDS% /nobreak >nul
goto monitor_loop


rem ============================================================
rem TRATAMENTO DE ERRO
rem ============================================================

:error
echo ERRO ao preparar contexto ou iniciar o monitor do Celery.
pause
exit /b 1