@echo off
setlocal EnableExtensions

rem ============================================================
rem dev_test.bat
rem ------------------------------------------------------------
rem Responsável por:
rem 1) Abrir janelas separadas para teste manual dos workers
rem 2) Abrir os workers minimizados
rem 3) Abrir o monitor do Celery somente se EIA1_DEBUG=TRUE
rem 4) Facilitar validacao local antes do uso no agendador
rem ============================================================


rem ============================================================
rem CONTEXTO DE EXECUCAO
rem ------------------------------------------------------------
rem Necessário aqui para ler EIA1_DEBUG e EIA1_REFRESH_SECONDS
rem antes de abrir os demais scripts
rem ============================================================

call "%~dp0EIA1_ENV_CONTEXT.cmd" || goto :error


rem ============================================================
rem DEFINICAO DOS SCRIPTS DE TESTE
rem ============================================================

set "DEV_TEST_RUN_WORKER_LIGHT=%~dp0run_worker_light.cmd"
set "DEV_TEST_RUN_WORKER_HEAVY=%~dp0run_worker_heavy.cmd"
set "DEV_TEST_RUN_WORKER_DOTNET=%~dp0run_worker_dotnet.cmd"
set "DEV_TEST_RUN_MONITOR=%~dp0run_monitor.cmd"


rem ============================================================
rem EXECUCAO DOS WORKERS
rem ------------------------------------------------------------
rem Os workers abrem minimizados para reduzir poluicao visual
rem ============================================================

start "worker_light"  /min cmd /k call "%DEV_TEST_RUN_WORKER_LIGHT%"
start "worker_heavy"  /min cmd /k call "%DEV_TEST_RUN_WORKER_HEAVY%"
start "worker_dotnet" /min cmd /k call "%DEV_TEST_RUN_WORKER_DOTNET%"


rem ============================================================
rem EXECUCAO OPCIONAL DO MONITOR
rem ------------------------------------------------------------
rem O monitor abre em janela normal apenas se EIA1_DEBUG=TRUE
rem ============================================================

if /I "%EIA1_DEBUG%"=="TRUE" (
    start "celery_monitor" cmd /k call "%DEV_TEST_RUN_MONITOR%"
)


rem ============================================================
rem ENCERRAMENTO
rem ============================================================

endlocal
exit /b 0


rem ============================================================
rem TRATAMENTO DE ERRO
rem ============================================================

:error
echo ERRO ao preparar o dev_test.bat.
pause
exit /b 1