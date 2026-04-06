# Run Workers · Celery / Windows

Este diretório contém os scripts responsáveis por inicializar os workers do Celery, o monitor de debug e o contexto central de execução do projeto.

A estrutura foi pensada para funcionar tanto em ambiente **DEV** quanto em **PROD**, centralizando as configurações no arquivo `EIA1_ENV_CONTEXT.cmd`.

---

## Objetivo

Esta pasta tem como finalidade:

- padronizar a inicialização dos workers do Celery;
- separar responsabilidades entre contexto, workers e monitoramento;
- facilitar execução local/manual;
- usar diretamente no ambiente windows server no **Agendador de Tarefas do Windows Server**;
- concentrar os **defines/configurações** em um único ponto.

---

## Arquivos da pasta

### `EIA1_ENV_CONTEXT.cmd`
Arquivo central de configuração e contexto.

Responsável por:

- identificar o ambiente atual através da variável `EIA1_PROJECT_ENV`;
- resolver caminhos base do projeto;
- definir filas, nomes de workers e arquivos de log;
- definir parâmetros de debug/monitoramento;
- validar a estrutura mínima esperada;
- exportar as variáveis para os scripts chamadores.

> Este é o principal arquivo de configuração da pasta.

---

### `run_worker_light.cmd`
Inicializa o worker leve do Celery.

Responsável por:

- carregar o contexto do projeto;
- entrar no diretório do projeto Django;
- limpar a fila leve;
- iniciar o worker da fila `default`.

---

### `run_worker_heavy.cmd`
Inicializa o worker pesado/serial do Celery.

Responsável por:

- carregar o contexto do projeto;
- entrar no diretório do projeto Django;
- limpar a fila pesada;
- iniciar o worker da fila `files_using_dwg`.

---

### `run_worker_dotnet.cmd`
Inicializa o worker dedicado à fila de integração com C# / .NET.

Responsável por:

- carregar o contexto do projeto;
- entrar no diretório do projeto Django;
- limpar a fila dotnet;
- iniciar o worker da fila `files_using_dwg_csharp`.

---

### `run_monitor.cmd`
Abre um prompt de monitoramento do Celery em loop.

Responsável por:

- carregar o contexto do projeto;
- executar comandos de inspeção do Celery;
- atualizar o monitor automaticamente conforme o define `EIA1_REFRESH_SECONDS`.

> Este script é voltado para troubleshooting e validação em ambiente local/dev.

---

### `dev_test.bat`
Script utilitário para testes manuais em ambiente local/dev.

Responsável por:

- abrir os workers em janelas separadas;
- abrir os workers **minimizados**;
- abrir o monitor de debug em janela normal, caso `EIA1_DEBUG=TRUE`.

> Este arquivo é voltado para uso manual.  
> No servidor, o ideal é agendar cada `run_worker_*.cmd` individualmente.

---

## Variável de ambiente obrigatória

Para que os scripts funcionem corretamente, é necessário configurar a variável de ambiente:

```bat
EIA1_PROJECT_ENV