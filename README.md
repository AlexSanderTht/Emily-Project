#  Regras de Criação de Branches e Commits

Define o padrão de **nomenclatura de branches** e **boas práticas de commits** adotado no repositório.  
O objetivo é garantir **organização, rastreabilidade e clareza** no histórico do projeto.

---

## 1. Regras para Criação de Branches

###  Padrão de nome

Todas as branches devem seguir o formato:

tipo_iniciais_dia_mes_ano__descricao

###  Exemplos:

features_devel_MCCD_05_11_2025__implementacao_login

bugfix_devel_MCCD_05_11_2025__corrigir_erro_autenticacao


###  Tipos permitidos:

| Prefixo           | Uso recomendado                                                                                         |
|-------------------|---------------------------------------------------------------------------------------------------------|
| `features_devel`  | Para novas funcionalidades; quando a branch deriva da devel.                                            |
| `features_master` | Para novas funcionalidades; quando a branch deriva da master. Não recomendável.                         |
| `bugfix_devel`    | Para correção de erros, falhas ou ajustes pontuais; quando a branch deriva da devel.                    |
| `bugfix_master`   | Para correção de erros, falhas ou ajustes pontuais; quando a branch deriva da master. Não recomendável. |
| `readme_`         | Para atualização de documentação; Evitar atualização direto no gitlab.                                  |
| `refactor_devel`  | Para refatoração de código;                                                                             |

Após mergear a branch de desenvolvimento na devel ou master, é importante selecionar a opção que não exclui a branch do gitlab. (Desmarcar "squash")

### Convenções adicionais:

- Utilize **apenas letras minúsculas** e **underscores (`_`)**, exceto as iniciais do nome que devem ser maiúscula.
- Após data, usar dois **underscores**.
- Não usar acentuação, espaços ou caracteres especiais.  
- A **descrição** deve ser curta e objetiva.  
- **Somente o mantenedor do repositório** deve criar novas branches.  
- Desenvolvedores **não devem criar branches**.  
- O fluxo de trabalho será controlado pelo líder, que informará qual branch utilizar.

---

## 2. Regras para Commits

Cada **tarefa** atribuída pelo líder deve gerar **pelo menos um commit** contendo:

1. Uma descrição clara e formal do que foi feito.  
2. Pontuação correta e uso de português formal.  
3. Foco no **resultado da alteração**, não no processo.
4. Após o termino da atividade, uma nova branch deve ser criada.
5. O propósito é manter a linha do tempo clara na sequência das branchs no gitlab.


### Estrutura recomendada:

[TIPO DE ALTERAÇÃO] Descrição clara e completa.

Os tipos de alteração podem ser:

[IMPLEMENTAÇÃO]: Para novas funcionalidades ou features.

- Implementações podem ser feita somente features_devel.
- Em casos particulares, pode-se commitar correções em uma branch features_devel.

[CORREÇÃO]: Para correção de bugs ou falhas.

- Correções podem ser feitas somente em branch do tipo bugfix_devel, ou como já mencionado, em features_devel em casos particulares.

[REFATORAÇÃO]: Para melhorias no código sem alterar a funcionalidade.

- Refatoração pode ser feito somente em branch do tipo refactor_devel.

[DOCUMENTAÇÃO]: Para atualizações na documentação do projeto.

- Documentação podem ser feitas somente em branch do tipo readme_.


### Exemplos de mensagens de commit:

[IMPLEMENTAÇÃO] Adicionada a tela de autenticação com validação de credenciais.

[CORREÇÃO] Ajustado o cálculo de imposto para evitar erro de arredondamento.

[REFATORAÇÃO] Exclusão dos arquivos de aniversariantes. 

[DOCUMENTAÇÃO] Atualizado o README com instruções de instalação.


### Boas práticas adicionais:

- Use o verbo **no particípio** (“adicionado”, “corrigido”, “implementado”).  
- Cada commit deve representar a tarefa realizada.  
- Antes de commitar, **revise e teste o código**.
- Dica: mapeie as diferenças do estado atual da sua branch com a hash da sua branch no momento que foi ramificada usando
o comando "git diff ...".

---

## 3. Exemplo completo de fluxo

1. O mantenedor cria a branch: features_devel_MCCD_05_11_2025__cadastro_de_usuarios
2. O desenvolvedor trabalha na task atribuída.
3. Após finalizar, cria o commit: [IMPLEMENTAÇÃO] Adicionada funcionalidade para lista de materiais.
4. Após todas as task atribuídas a branch criada, o merge é realizado pelo mantenedor.
5. Dica: caso a devel/master já tenha recebido merges, conflitos vão aparecer para uma branch que foi ramificada num ponto
anterior da história. Uma forma de contornar isso, é usar o comando "git rebase ...", ou seja, é uma forma da sua branch
capturar as mudanças e atualizar seu histórico ante dela ser mergeada na master/devel.

---

#  Boas práticas de desenvolvimento para o projeto

## 1. BACKEND 
Define o padrão de nomenclatura de variáveis, funções e módulos dentro do projeto EIA1Fer.
- Funções criadas dentro do módulo para o próprio módulo (quando não são importadas) deve começar com a palavra "_f";
- Funções que são importadas na view devem começar com a palavra "view";
- Funções que são importadas para outros módulos começam com a palavra "aux";
- As funções devem ser modulares;
- Função que são usadas em vários módulos devem ser desenvolvidas no módulo utils_general.py;
- As atividades de gravar no banco e processar dados devem estar em diferentes definições;
- 

## 2. FRONTEND
Define o padrão de nomenclatura de variáveis, parâmetros, métodos, handlers e funções dentro do projeto EIA1Fer.
- Esta tabela define o padrão de nomenclatura adotado para o código JavaScript do projeto, com exemplos reais em português, visando padronização, legibilidade e facilidade de manutenção.

| Tipo                     | Convenção de Nomenclatura | Exemplo real do projeto |
|--------------------------|---------------------------|-------------------------|
| Função global            | camelCase                 | `abrirFerramenta(evt, nome)` |
| Função anônima (IIFE)    | function wrapper          | `(function () { ... })();` |
| Método de evento         | camelCase (verbo)         | `handleEnvio()` |
| Callback                 | camelCase                 | `aoSucesso(resposta)` |
| Variável local           | camelCase                 | `var conteudoAba;` |
| Parâmetro de função      | camelCase                 | `function abrirFerramenta(evt, nome)` |
| Propriedade de objeto    | camelCase                 | `evt.alvoAtual` |
| Constante                | UPPER_SNAKE_CASE          | `const MAX_TENTATIVAS = 5;` |
| Função auxiliar          | camelCase                 | `formatarData()` |
| Função privada (módulo)  | `_camelCase`              | `_tratarFallback()` |
| Função AJAX              | camelCase                 | `ajaxExcluirRegistro()` |
| Handler DOM              | camelCase (verbo)         | `abrirFerramenta()` |
| Arquivo JavaScript       | kebab-case                | `a1pro.js` |

- Convenção de comentários

1. Comentário de linha (//)  
    - Uso: explicar decisões, regras de negócio, fluxos alternativos ou comportamentos não óbvios.  
    - Exemplo:
    ```js
    // Explica por que escolhemos essa abordagem
    ```

2. Comentário de bloco (/* */)  
    - Uso: documentar funções, especialmente as que executam ações críticas.  
    - Exemplo:
    ```js
    /*
     * Valida e persiste os dados do usuário.
     * Observação: chamada bloqueante.
     */
    ```

3. Comentário com parâmetros (@param)  
    - Uso: deixar claro o papel de cada argumento da função.  
    - Exemplo:
    ```js
    /**
     * Processa pedido.
     * @param {number} idPedido - Identificador do pedido simples
     * @param {string} usuario - Usuário que iniciou a ação
     */
    ```

4. Comentário de retorno (@returns)  
    - Uso: quando o retorno não é óbvio.  
    - Exemplo:
    ```js
    /**
     * @returns {boolean} - true se a operação for concluída, false caso contrário
     */
    ```

5. Comentário de fluxo especial / fallback  
    - Uso: obrigatório quando existe caminho alternativo no código; explicar condição e impacto.  
    - Exemplo:
    ```js
    // Fallback: se o serviço externo falhar, usar cache local
    ```

---

# Configuração do ambiente de desenvolvimento

1) Python 3.8.0: https://www.python.org/downloads/release/python-380/

2) IDE recomendada: https://www.jetbrains.com/pt-br/pycharm/download/#section=windows

3) Git: https://git-scm.com/downloads

4) Mysql odbc 3.51: https://downloads.mysql.com/archives/c-odbc/

* Na pasta ``` P:\SEA\desenvolvimento\Requirements_A1fer ``` há esse pluging.

5) Redis (broker): https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504

6) Apache Lounge (servidor): https://www.apachelounge.com/download/
* Descompactar e seguir as instruções do readme.txt (somente se precisar reconfigurar o servidor)

7) Instalar Microsoft C++ Build Tools: https://visualstudio.microsoft.com/pt-br/visual-cpp-build-tools/

8) Clonando o repositório:
* Criar pasta com o nome de "EIA1Project" no seu Disco Local C; dentro dessa pasta, crie outra pasta com o nome de "htdocs" que 
é o onde deve-se clonar o projeto.
9) Configure o ambiente virtual no diretório C:\EIA1Project\; instale os pacotes listados no requirements na versão do pip correta; o ambiente virtual
deve ser da versão 3.8.0;
* Para evitar problemas de dependências, o gerenciador de pacotes (pip) deve ser usado na versão 23.3 dentro do ambiente virtual.
(COMANDO: **python -m pip install --upgrade pip==23.3.1**)
* Caso alguma lib não for instalada corretamente, ela deverá ser instalada manualmente. (COMANDO: **pip install 'Nome da biblioteca'**)
10) Copiar todos os arquivos do diretório `P:\SEA\desenvolvimento\Requirements_A1fer` para a pasta `htdocs`, não copiar a pasta ``` nao copiar -  pasta de bat```.
11) Setar as variáveis de ambiente disponibilizadas pela TI:
* A1_HUB_BLOCK_ROBODOC;
* A1_HUB_ROBODOC_MAX_REQUEST;
* A1_HUB_DEBUG_EMAIL;
* A1_HUB_ENV;
* A1_HUB_HOST;
* A1_SECRET_KEY;
* ALLOWED_HOSTS;
12) Criar pasta logs dentro de C:\A1Fer\htdocs\a1pro\weba1\;
13) Configure sua IDE para executar o arquivo manege.py que executa o Django. (COMANDO: python manage.py runserver)
* Para ligar o celery utilizar a bat task.bat.

---

# Configuração do servidor

Se necessário, siga as etapas:

1) Descompacte o Apache no C:\ e entrar na pasta.
* Para iniciar o apache como serviço, rodar o comando no CMD: bin\httpd.exe -k install
* Para startar o serviço, rodar o comando no CMD:httpd.exe -k start
* Para pausar o serviço, rodar o comando no CMD: httpd.exe -k stop
2) Criar o arquivo host.conf no caminho: C:\Apache24\conf\extra\
3) Copiar o conteúdo do arquivo httpd.conf.template e colar no arquivo criado no passo anterior.
4) Executar o comando mod_wsgi-express module-config no CMD e compara as variáveis, se estiverem diferentes substituir as do arquivo host.conf.
5) Editar o arquivo https.conf colocando o comando abaixo:
* COMANDO: Include conf/extra/host.conf;
6) No diretório do projeto C:\a1review\review executar os comandos:
* COMANDO: Python manage.py collectstatic;
7) Na pasta do apache rodar o comando no CMD httpd.exe -k restart;

---

# Detalhes gerais da aplicação

O projeto EIA1Ferramentas foi desenvolvido no framework Django, roda sobre um servidor http apache; utilza o sistema de 
fila do broker redis orquestrado pelo gerenciador celery;