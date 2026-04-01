@echo off
setlocal EnableExtensions

rem ============================================================
rem EIA1_ENV_CONTEXT.cmd
rem ------------------------------------------------------------
rem Responsável por:
rem 1) Identificar o ambiente pela variavel EIA1_PROJECT_ENV
rem 2) Resolver os caminhos base do projeto
rem 3) Definir filas, nomes de workers e nomes de logs
rem 4) Validar estrutura minima esperada
rem 5) Exportar as variaveis para os scripts chamadores
rem ============================================================

rem ============================================================
rem CONFIGURACOES DE DEBUG E MONITORAMENTO
rem ------------------------------------------------------------
rem EIA1_DEBUG:
rem TRUE  = abre o prompt de monitoramento no dev_test.bat
rem FALSE = nao abre o monitor
rem
rem EIA1_REFRESH_SECONDS:
rem intervalo, em segundos, para atualizar o monitor
rem ============================================================

set "EIA1_DEBUG=FALSE"
set "EIA1_REFRESH_SECONDS=5"

rem ============================================================
rem CONFIGURACOES DE AMBIENTE
rem ------------------------------------------------------------
rem Ajuste estes valores caso a estrutura do projeto mude
rem ============================================================

set "DEFINE_ENV_DEV=dev"
set "DEFINE_ENV_PROD=prod"

set "PATH_PROJECT_DEV=C:\EIA1Project"
set "PATH_PROJECT_PROD=C:\A1Fer"

set "PATH_FERRAMENTAS_DEV=eia1ferramentas"
set "PATH_FERRAMENTAS_PROD=a1ferramentas"

set "PATH_DJANGO_PROJECT=weba1"
set "PATH_LOG_FOLDER=logs"
set "EIA1_CELERY_APP=weba1"



rem ============================================================
rem DEFINES / CONFIGURACOES DE FILAS E WORKERS
rem ------------------------------------------------------------
rem Ajuste estes valores caso filas, nomes de workers ou logs
rem precisem mudar futuramente
rem ============================================================

set "EIA1_QUEUE_LIGHT=default"
set "EIA1_QUEUE_HEAVY=files_using_dwg"
set "EIA1_QUEUE_DOTNET=files_using_dwg_csharp"

set "EIA1_WORKER_LIGHT_NAME=worker_default@%%h"
set "EIA1_WORKER_HEAVY_NAME=worker_files_dwg@%%h"
set "EIA1_WORKER_DOTNET_NAME=worker_files_dwg_csharp@%%h"

set "EIA1_WORKER_LIGHT_LOG_NAME=celery_default_debug.log"
set "EIA1_WORKER_HEAVY_LOG_NAME=celery_files_dwg_debug.log"
set "EIA1_WORKER_DOTNET_LOG_NAME=celery_files_dwg_csharp_debug.log"


rem ============================================================
rem VALIDACAO DO AMBIENTE
rem ============================================================

if "%EIA1_PROJECT_ENV%"=="" (
    echo ERRO: a variavel EIA1_PROJECT_ENV nao esta definida.
    echo Valores aceitos: %DEFINE_ENV_DEV% ou %DEFINE_ENV_PROD%
    exit /b 1
)


rem ============================================================
rem RESOLUCAO DOS CAMINHOS POR AMBIENTE
rem ============================================================

if /I "%EIA1_PROJECT_ENV%"=="%DEFINE_ENV_DEV%" (
    set "EIA1_BASE_DIR=%PATH_PROJECT_DEV%"
    set "EIA1_FERRAMENTAS_DIR=%PATH_PROJECT_DEV%\htdocs\%PATH_FERRAMENTAS_DEV%"
) else if /I "%EIA1_PROJECT_ENV%"=="%DEFINE_ENV_PROD%" (
    set "EIA1_BASE_DIR=%PATH_PROJECT_PROD%"
    set "EIA1_FERRAMENTAS_DIR=%PATH_PROJECT_PROD%\htdocs\%PATH_FERRAMENTAS_PROD%"
) else (
    echo ERRO: valor invalido para EIA1_PROJECT_ENV=%EIA1_PROJECT_ENV%
    echo Valores aceitos: %DEFINE_ENV_DEV% ou %DEFINE_ENV_PROD%
    exit /b 1
)


rem ============================================================
rem CAMINHOS DERIVADOS
rem ============================================================

set "EIA1_VENV_DIR=%EIA1_BASE_DIR%\venv"
set "EIA1_PROJ_DIR=%EIA1_FERRAMENTAS_DIR%\%PATH_DJANGO_PROJECT%"
set "EIA1_LOG_DIR=%EIA1_BASE_DIR%\%PATH_LOG_FOLDER%"
set "EIA1_RUN_WORKERS_DIR=%~dp0"

set "EIA1_VENV_PYTHON_EXE=%EIA1_VENV_DIR%\Scripts\python.exe"

set "EIA1_WORKER_LIGHT_LOG_FILE=%EIA1_LOG_DIR%\%EIA1_WORKER_LIGHT_LOG_NAME%"
set "EIA1_WORKER_HEAVY_LOG_FILE=%EIA1_LOG_DIR%\%EIA1_WORKER_HEAVY_LOG_NAME%"
set "EIA1_WORKER_DOTNET_LOG_FILE=%EIA1_LOG_DIR%\%EIA1_WORKER_DOTNET_LOG_NAME%"


rem ============================================================
rem VALIDACOES
rem ============================================================

if not exist "%EIA1_VENV_PYTHON_EXE%" (
    echo ERRO: nao encontrei "%EIA1_VENV_PYTHON_EXE%"
    exit /b 1
)

if not exist "%EIA1_PROJ_DIR%\manage.py" (
    echo ERRO: nao encontrei "%EIA1_PROJ_DIR%\manage.py"
    exit /b 1
)

if not exist "%EIA1_LOG_DIR%" mkdir "%EIA1_LOG_DIR%"


rem ============================================================
rem EXPORTACAO DAS VARIAVEIS PARA O SCRIPT CHAMADOR
rem ============================================================

endlocal & (

    set "EIA1_DEBUG=%EIA1_DEBUG%"
    set "EIA1_REFRESH_SECONDS=%EIA1_REFRESH_SECONDS%"

    set "EIA1_BASE_DIR=%EIA1_BASE_DIR%"
    set "EIA1_FERRAMENTAS_DIR=%EIA1_FERRAMENTAS_DIR%"
    set "EIA1_VENV_DIR=%EIA1_VENV_DIR%"
    set "EIA1_PROJ_DIR=%EIA1_PROJ_DIR%"
    set "EIA1_LOG_DIR=%EIA1_LOG_DIR%"
    set "EIA1_RUN_WORKERS_DIR=%EIA1_RUN_WORKERS_DIR%"
    set "EIA1_VENV_PYTHON_EXE=%EIA1_VENV_PYTHON_EXE%"
    set "EIA1_CELERY_APP=%EIA1_CELERY_APP%"

    set "EIA1_QUEUE_LIGHT=%EIA1_QUEUE_LIGHT%"
    set "EIA1_QUEUE_HEAVY=%EIA1_QUEUE_HEAVY%"
    set "EIA1_QUEUE_DOTNET=%EIA1_QUEUE_DOTNET%"

    set "EIA1_WORKER_LIGHT_NAME=%EIA1_WORKER_LIGHT_NAME%"
    set "EIA1_WORKER_HEAVY_NAME=%EIA1_WORKER_HEAVY_NAME%"
    set "EIA1_WORKER_DOTNET_NAME=%EIA1_WORKER_DOTNET_NAME%"

    set "EIA1_WORKER_LIGHT_LOG_FILE=%EIA1_WORKER_LIGHT_LOG_FILE%"
    set "EIA1_WORKER_HEAVY_LOG_FILE=%EIA1_WORKER_HEAVY_LOG_FILE%"
    set "EIA1_WORKER_DOTNET_LOG_FILE=%EIA1_WORKER_DOTNET_LOG_FILE%"
)

exit /b 0