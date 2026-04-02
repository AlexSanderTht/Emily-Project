# Emily English Platform

Aplicacao Django atual do Projeto Emily.

## Objetivo

Este repositorio contem somente o app atual da Emily (Emily English Platform).
Referencias a apps antigos foram removidas deste README.

## Como rodar em outro PC (Windows)

### 1. Pre-requisitos
1. Git instalado
2. Python 3.8 ou superior
3. PowerShell
4. Redis (opcional, apenas para Celery)

### 2. Clonar o repositorio
```powershell
git clone URL_DO_SEU_REPOSITORIO
cd ProjetoEmily
```

### 3. Criar e ativar ambiente virtual
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

### 4. Instalar dependencias
```powershell
pip install -r EMProject\htdocs\emproject\requirements\requirements.txt
```

### 5. Configurar variaveis de ambiente
No PowerShell, antes de subir o projeto:

```powershell
$env:A1_HUB_ENV="dev"
$env:A1_HUB_DEBUG_EMAIL="1"
$env:A1_HUB_BLOCK_ROBODOC="N"
$env:A1_HUB_ROBODOC_MAX_REQUEST="10"
```

Opcional:

```powershell
$env:A1_SECRET_KEY="chave-local-qualquer"
```

### 6. Ir para a pasta do projeto Django
```powershell
cd EMProject\htdocs\emproject\weba1
```

### 7. Preparar banco local
```powershell
python manage.py migrate
```

Observacao:
- A sessao esta configurada para cookie assinado no ambiente atual.
- Mesmo assim, manter o migrate evita erros de tabelas ausentes.

### 8. Subir servidor
```powershell
python manage.py runserver 8000
```

Acessar:
- http://127.0.0.1:8000

## Execucao opcional de Celery

Se for usar tarefas assincronas:

1. Suba o Redis local.
2. Em outro terminal (com a venv ativa e na pasta do projeto), rode:

```powershell
celery -A weba1 worker -l info
```

## Problemas comuns

### Erro de variavel de ambiente ausente
Se aparecer erro de A1_HUB_ENV ou similares, confirme as variaveis da etapa 5 no terminal atual.

### Erro de tabela ausente no SQLite
Rode novamente:

```powershell
python manage.py migrate
```

### Dependencias nao instaladas
Rode novamente:

```powershell
pip install -r EMProject\htdocs\emproject\requirements\requirements.txt
```

