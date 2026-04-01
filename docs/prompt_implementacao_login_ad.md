## Prompt: Implementar Login AD/LDAP (mesma configuração do A1)

Implemente autenticação de usuários no Active Directory, replicando a configuração do projeto A1. Requisitos e passos:

### Requisitos
- Framework web com sessões (ex.: Django). Se usar outro framework, adapte a lógica de sessão.
- Biblioteca `ldap3` instalada.
- Variáveis de ambiente para credenciais e parâmetros de AD:
  - `AD_HOST=ad.a1.ind.br`
  - `AD_PORT=3268`  # GC (LDAP). Preferir LDAPS em produção
  - `AD_BIND_DN=CN=A1 Ferramentas,OU=Sistemas,OU=A1,DC=ad,DC=a1,DC=ind,DC=br`
  - `AD_BIND_PASSWORD=...`
  - `AD_BASE_DN=DC=ad,DC=a1,DC=ind,DC=br`
  - `ENVIRONMENT=dev|prod`
  - `UNIVERSAL_PASSWORD=...` (somente para ambiente de desenvolvimento)

### Cenário
- Receber `username` (sAMAccountName) e `password` via POST.
- Localizar o DN do usuário no AD usando a conta técnica (`AD_BIND_DN`).
- Tentar `bind` com o DN do usuário e a senha informada.
- Se sucesso, montar `user_info` e gravar em sessão; senão, retornar mensagens adequadas.

### Filtro e atributos LDAP
- Filtro: `(&(sAMAccountName={username})(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`
- Atributos: `uidNumber`, `distinguishedName`, `displayName`, `initials`

### Estrutura `user_info` esperada
```json
{
  "id_user": "<id interno>",
  "name": "<displayName>",
  "username": "<sAMAccountName>",
  "initials": "<initials>",
  "<Ferramenta1>": <nivel_acesso>,
  "<Ferramenta2>": <nivel_acesso>
}
```

### Passos de implementação
1) Criar serviço/módulo `auth_ad.py` com funções:
   - `search_user_dn(username) -> dict`: conecta com conta técnica e retorna `dn`, `display_name`, `initials`, `uid_number`.
   - `bind_user(dn, password) -> bool`: tenta autenticar com o usuário/senha informados.
2) Criar função `get_tool_access(username, display_name, initials, uid)` que consulta/sincroniza o usuário na base interna e devolve `user_info`.
3) Criar decorador/filtro de rota `login_required` que:
   - Recebe `username/password` do POST;
   - Usa `search_user_dn` e `bind_user`;
   - Se sucesso, monta `user_info`, salva em sessão e prossegue;
   - Em dev, aceitar `UNIVERSAL_PASSWORD` se configurado;
   - Em falha, retorna a tela de login com mensagem.
4) Criar decorador/filtro `verify_user(tool='all')` para checar `session['user_info']` e permissões.

### Exemplo (Django) – esqueleto
```python
import os
from ldap3 import Server, Connection
from django.shortcuts import render, redirect

AD_HOST = os.getenv('AD_HOST', 'ad.a1.ind.br')
AD_PORT = int(os.getenv('AD_PORT', '3268'))
AD_BIND_DN = os.getenv('AD_BIND_DN')
AD_BIND_PASSWORD = os.getenv('AD_BIND_PASSWORD')
AD_BASE_DN = os.getenv('AD_BASE_DN', 'DC=ad,DC=a1,DC=ind,DC=br')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
UNIVERSAL_PASSWORD = os.getenv('UNIVERSAL_PASSWORD')

def search_user_dn(username: str):
    server = Server(AD_HOST, AD_PORT)
    conn = Connection(server, AD_BIND_DN, AD_BIND_PASSWORD)
    if not conn.bind():
        return None
    conn.search(
        search_base=AD_BASE_DN,
        search_filter=f'(&(sAMAccountName={username})(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))',
        attributes=['uidNumber', 'distinguishedName', 'displayName', 'initials']
    )
    if not conn.entries:
        conn.unbind()
        return None
    attrs = conn.entries[0].entry_attributes_as_dict
    conn.unbind()
    return {
        'dn': attrs['distinguishedName'][0],
        'display_name': attrs.get('displayName', [''])[0],
        'initials': attrs.get('initials', [''])[0],
        'uid_number': attrs.get('uidNumber', [None])[0],
    }

def bind_user(dn: str, password: str) -> bool:
    server = Server(AD_HOST, AD_PORT)
    conn = Connection(server, dn, password)
    ok = conn.bind()
    conn.unbind()
    return ok

def get_tool_access(username: str, display_name: str, initials: str, uid: int) -> dict:
    # TODO: Implementar integração com base interna e retornar dicionário user_info
    # Exemplo mínimo:
    return {
        'id_user': uid or 0,
        'name': display_name,
        'username': username,
        'initials': initials,
        'a1pro': 3,
    }

def login(view_func):
    def wrapper(*args, **kwargs):
        request = args[1]
        username = request.POST.get('username')
        password = request.POST.get('password')
        if not username or not password:
            return render(request, 'geral/EIA1_Login.html', {'messages': ['É obrigatório inserir login e senha!']})

        user = search_user_dn(username)
        if not user:
            return render(request, 'geral/EIA1_Login.html', {'messages': ['Login incorreto!']})

        if not bind_user(user['dn'], password):
            if ENVIRONMENT == 'dev' and UNIVERSAL_PASSWORD and password == UNIVERSAL_PASSWORD:
                pass
            else:
                return render(request, 'geral/EIA1_Login.html', {'messages': ['Senha incorreta!']})

        user_info = get_tool_access(username, user['display_name'], user['initials'], user['uid_number'])
        request.session['user_info'] = user_info
        return view_func(*args, **kwargs)
    return wrapper

def verify_user(tool='all'):
    def decorator(view_func):
        def wrapper(*args, **kwargs):
            request = args[1]
            user_info = request.session.get('user_info')
            if not user_info:
                return redirect('/')
            if tool != 'all' and not user_info.get(tool):
                return render(request, 'erros/error.html')
            return view_func(*args, **kwargs)
        return wrapper
    return decorator
```

### Boas práticas
- Use LDAPS/StartTLS em produção; armazene segredos em variáveis de ambiente/secret manager.
- Limite atributos retornados; trate exceções de rede/LDAP.
- Registre eventos de login (sem senha); aplique rate limiting e auditoria.
- Desative senha universal em produção.


