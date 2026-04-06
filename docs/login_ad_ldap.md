## Login via Active Directory (LDAP) – Documentação

### Visão geral
O projeto realiza autenticação de usuários no Active Directory (AD) utilizando a biblioteca `ldap3`. O fluxo principal está implementado através de um decorador que:
- recebe `username` e `password` do formulário de login;
- resolve o `distinguishedName` (DN) do usuário a partir do `sAMAccountName`;
- tenta autenticar (bind) no AD com o DN e a senha informada;
- ao autenticar com sucesso, busca/gera o cadastro do usuário no hub e grava `session['user_info']`;
- impede acesso às views protegidas caso a sessão não esteja válida, via outro decorador de verificação de acesso.

### Principais arquivos e funções
- Autenticação AD (decorador): `weba1/weba1/utils.py::login`
- Verificação de sessão e acesso: `weba1/weba1/utils.py::verify_user`
- Montagem de `user_info` e cadastro de permissões: `weba1/a1hub/utils.py::get_tool_access`
- Tela de login: `weba1/weba1/views.py::Home` → `login.html`

### Dependências
- `ldap3==2.7` (listada em `requirements.txt`)
- Django (middleware de sessão ativo)

### Configuração do AD
- Servidor/porta: `ad.a1.ind.br:3268` (GC LDAP)
- Conta técnica para pesquisa inicial (bind de serviço):
  - DN: `CN=A1 Ferramentas,OU=Sistemas,OU=A1,DC=ad,DC=a1,DC=ind,DC=br`
  - Senha: armazenada no código atual; recomenda-se mover para variáveis de ambiente
- Bases de pesquisa: `DC=ad,DC=a1,DC=ind,DC=br`
- Filtro para localizar usuário por `sAMAccountName` e evitar contas desabilitadas:
  - `(&(sAMAccountName={username})(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`
- Atributos recuperados: `uidNumber`, `distinguishedName`, `displayName`, `initials`

### Fluxo detalhado do login
1) Receber `username` e `password` do POST do formulário.
2) Conectar ao AD usando a conta técnica e realizar `search` por `sAMAccountName` para obter DN/nome/iniciais/uid:
   - Em caso de não encontrado: retornar `login.html` com mensagem "Login incorreto!".
3) Tentar autenticação do usuário: `bind` com `Connection(server, distinguished_name, password)`.
   - Se falhar:
     - opcionalmente, em ambiente `DEVEL`, aceitar `universal_password` (senha universal) e prosseguir;
     - senão, retornar `login.html` com mensagem "Senha incorreta!".
4) Se autenticar:
   - montar `user_info` via `get_tool_access(username, display_name, initials, uid)`;
   - registrar `last_login` em sessão;
   - salvar `session['user_info'] = user_info`;
   - seguir o fluxo original da view decorada.
5) Caso o usuário não exista no hub, `get_tool_access` realiza o cadastro e permissões padrão.

### Estrutura de sessão (`user_info`)
`user_info` é um dicionário contendo, além de permissões por ferramenta, os campos:
- `id_user`: identificador do usuário no hub
- `name`: nome completo
- `username`: login LDAP (`sAMAccountName`)
- `initials`: iniciais

### Proteção de rotas (pós-login)
- Decorador `verify_user(tool='all')`:
  - Verifica se `session['user_info']` existe;
  - Opcionalmente, valida se o usuário possui acesso à ferramenta específica (`tool`);
  - Redireciona à raiz `/` (login) quando a sessão não é válida.

### Mensagens de erro usuais
- "É obrigatório inserir login e senha!"
- "Login incorreto!"
- "Senha incorreta!"
- "Este usuário não está cadastrado no a1hub!" (quando não há mapeamento na base interna)

### Segurança e recomendações
- Mover DN e senha da conta técnica para variáveis de ambiente (não deixar em código-fonte).
- Usar conexão LDAPS/StartTLS quando possível.
- Limitar os atributos retornados na consulta LDAP ao mínimo necessário.
- Registrar tentativas de login (com cuidado para não persistir senhas) e aplicar rate-limiting.
- Diferenciar claramente ambientes (dev/homolog/produção); evitar senha universal em produção.

### Exemplo de uso dos decoradores
```python
from weba1.utils import login, verify_user

@login
def post(self, request):
    # Se chegou aqui, login foi processado
    ...

@verify_user('a1pro')
def get(self, request):
    # Sessão válida e usuário com acesso à ferramenta
    ...
```

### Integrações relacionadas (não fazem o login principal)
- `weba1/civil/validarUser.py::verify_usert`: variante específica para o app Civil.
- `weba1/a1hub/utils.py::intranet_to_hub_cg`: resolve `sAMAccountName` via LDAP durante sincronização de cadastros.


