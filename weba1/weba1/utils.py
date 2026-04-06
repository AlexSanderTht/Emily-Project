import os
from os import path as ospath
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from ldap3 import Server, Connection
from a1hub.utils import create_path, get_tool_access, register_log
from a1hub.utils import create_path
from .password import universal_password
from .settings import DEVEL
from a1hub.log import env_logs
from django.shortcuts import redirect
from datetime import date, datetime
from django.utils import timezone
from celery import shared_task
from .settings import DATABASES
def upload(path):
    """
    Realiza o upload dos arquivos para a pasta temporária.

    Parameters
    ----------
    path: list
        Lista com django files.

    Returns
    -------
    tmp : str
        Caminho da pasta temporária, ou caminho do arquivo se só existir 1.

    """
    if not path:
        return None
    elif type(path) != list:
        path = [path]
    if len(path) == 1:
        is_file = True
    else:
        is_file = False
    #Cria a pasta temporária.
    tmp = create_path()
    fs = FileSystemStorage(location=tmp)
    #Salva os arquivos localmente.
    for file in path:
        fs.save(file.name, file)
        if is_file:
            tmp = ospath.join(tmp, file.name)
    return tmp


def login(func):
    def wrapper(*args, **kwargs):
        request = args[1]
        # (fulano.tal, Fulano de Tal, geral)
        username = request.POST.get('username')
        password = request.POST.get('password')
        if username and password:
            # Conecta com o login da ferramenta para pesquisar o dn da pessoa.
            server = Server('ad.a1.ind.br', 3268)
            conn = Connection(server, 'CN=A1 Ferramentas,OU=Sistemas,OU=A1,DC=ad,DC=a1,DC=ind,DC=br',
                              'Jo2e5jhnzbgMzKSzN4rw')
            conn.bind()
            conn.search(
                search_base='DC=ad,DC=a1,DC=ind,DC=br',
                search_filter=f'(&(sAMAccountName={username})(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))',
                attributes=['uidNumber', 'distinguishedName', 'displayName', 'initials'])
            # Verifica se o usuário está correto.
            if conn.entries:
                entries = conn.entries[0].entry_attributes_as_dict
                distinguished_name = entries['distinguishedName'][0]
                display_name = entries['displayName'][0]
                initials = entries['initials'][0]
                uid_number = entries['uidNumber'][0]
                conn = Connection(server, distinguished_name, password)
                # Verifica se a senha está correta.
                if not conn.bind():
                    conn.unbind()
                    user_info = get_tool_access(username=username, display_name=display_name,
                                                initials=initials)
                    if (password == universal_password) and (DEVEL == 'dev'):# Utilização da senha universal para o ambiente devel
                        request.session['user_info'] = user_info
                        try:
                            register_log_task.delay(tool='Login', error=False, **user_info)
                            pass
                        except:
                            return func(*args, **kwargs)
                        return func(*args, **kwargs)
                    else:
                        try:
                            register_log_task.delay(tool='Login', error=False, **user_info)
                        except:
                            ...
                        return render(request, 'geral/EIA1-login.html', context={'messages': ['Senha incorreta!']})
                else:
                    conn.unbind()
                    user_info = get_tool_access(username=username, display_name=display_name,
                                                initials=initials, uid=uid_number)
                    request.session['last_login'] = str(timezone.now())
                    if user_info:
                        request.session['user_info'] = user_info
                        try:
                            register_log_task.delay(tool='Login', error=False, **user_info)
                        except:
                            return func(*args, **kwargs)
                        return func(*args, **kwargs)
                    return render(request, 'geral/EIA1-login.html', context={'messages': ['Este usuário não está cadastrado no a1hub!']})
            return render(request, 'geral/EIA1-login.html', context={'messages': ['Login incorreto!']})
        return render(request, 'geral/EIA1-login.html', context={'messages': ['É obrigatório inserir login e senha!']})
    return wrapper


def verify_user(tool='all'):
    # se a pessoa não pode usar uma ferramenta então ela não terá cadastro nessa ferramenta.
    def decorator(func):
        def wrapper(*args, **kwargs):
            request = args[1]
            user_info = request.session.get('user_info')
            # last_login = request.session.get('last_login', 'Not set')
            if user_info:
                if tool == 'all' or user_info.get(tool):
                    # register_log_task.delay(tool=tool, **user_info)
                    return func(*args, **kwargs)
            else:
                return redirect('/')
            return render(request, 'erros/error.html')
        return wrapper
    return decorator


@shared_task(bind=True, name='weba1.logs')
def register_log_task(self, tool, *args, **user_info):
    register_log(user_info['username'], tool)  # faz o log do usuário na ferramenta
    env_logs(user_info['username'], tool=tool)

