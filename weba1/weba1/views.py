# -*- coding: utf-8 -*-
"""
Created on Mon Mar  9 16:59:22 2020

@author: luiz.rocha
"""
import os

import encodings.ascii
from os import path as ospathex

import openpyxl
from django.views import View
from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse, JsonResponse
from django_celery_results.models import TaskResult
from a1hub.task_test import go_to_sleep
from a1hub.models import TbHistoricTask
from .utils import login, verify_user
from django.template import RequestContext
from a1hub.utils import save_task_user_id
from os import path as ospath
from asgiref.sync import sync_to_async
from a1hub.models import TbHistoricTask, TbPerson
from django_celery_results.models import TaskResult
import logging
import json
import aioredis
import redis
from django.core.cache import cache

logger = logging.getLogger("channels")


def handler_400(request, exception=None):
    return render(request, 'erros/400.html', status=400)


def handler_403(request, exception=None):
    return render(request, 'erros/403.html', status=403)


def handler_404(request, exception=None):
    # Simple 404 handler - don't interfere with static files
    return render(request, 'erros/404.html', status=404)


def handler_500(request, exception=None):
    return render(request, 'erros/500.html', status=500)


def serve_static(request, path):
    """Custom view to serve static files"""
    import mimetypes
    from django.conf import settings
    from django.contrib.staticfiles import finders
    from django.http import FileResponse, Http404

    # Resolve file using Django staticfiles finders so app-level static files work.
    file_path = finders.find(path)
    if not file_path:
        # Fallback for projects that keep some assets only in STATICFILES_DIRS.
        if settings.STATICFILES_DIRS:
            static_dir = settings.STATICFILES_DIRS[0]
            candidate = os.path.normpath(os.path.join(static_dir, path))
            static_dir_normalized = os.path.normpath(static_dir)
            if candidate.startswith(static_dir_normalized):
                file_path = candidate

    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        raise Http404("File not found")

    # Determine content type
    content_type, encoding = mimetypes.guess_type(file_path)
    if content_type is None:
        content_type = 'application/octet-stream'

    return FileResponse(open(file_path, 'rb'), content_type=content_type)


class DownLoad(View):
    @verify_user()
    def get(self, request):
        task_id = request.session.get('task_id')
        try:
            task_result = TaskResult.objects.get(task_id=task_id)
            
            # Verificar se a tarefa foi bem-sucedida
            if task_result.status != 'SUCCESS':
                # Extrai mensagem de erro, tentando decodificar JSON de exceptions do Celery
                raw_result = task_result.result
                error_message = 'Tarefa falhou sem mensagem de erro específica.'
                try:
                    parsed = None
                    if isinstance(raw_result, str):
                        try:
                            parsed = json.loads(raw_result)
                        except Exception:
                            # Tenta remover aspas externas e tentar novamente
                            parsed = json.loads(raw_result.strip('"'))
                    elif isinstance(raw_result, (dict, list)):
                        parsed = raw_result
                    if isinstance(parsed, dict) and 'exc_message' in parsed:
                        msg = parsed['exc_message']
                        if isinstance(msg, list):
                            error_message = '\n'.join(str(m) for m in msg)
                        else:
                            error_message = str(msg)
                    elif parsed is not None:
                        error_message = str(parsed)
                    else:
                        error_message = str(raw_result)
                except Exception:
                    error_message = str(raw_result) if raw_result else error_message
                
                # Tratamento específico para erros do A1MatList
                if 'A1MatList' in str(task_result.task_name) or 'lst_pri' in str(task_result.task_name) or 'lst_sec' in str(task_result.task_name) or 'lst_iso' in str(task_result.task_name) or 'lst_mont' in str(task_result.task_name):
                    # Verificar se é erro de cabeçalho
                    if ('HEADER ERRADO' in error_message or 'header_errado' in error_message \
                        or 'CABEALHO' in error_message or 'CABEÇALHO' in error_message):
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro no Cabeçalho do Arquivo</h3><p><strong>Problema:</strong> O cabeçalho do seu arquivo não está no formato correto.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Verifique se o cabeçalho do arquivo está exatamente como no template fornecido.</p></div>', content_type='text/html; charset=utf-8')
                    
                    # Verificar se é erro de códigos não cadastrados
                    elif 'codigos_nao_cadastrados' in error_message or 'CÓDIGOS NÃO CADASTRADOS' in error_message:
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Códigos Não Cadastrados</h3><p><strong>Problema:</strong> Alguns códigos de materiais não estão cadastrados no banco de dados.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Cadastre os códigos faltantes ou use códigos já existentes no sistema.</p></div>', content_type='text/html; charset=utf-8')
                    
                    # Verificar se é erro de arredondamento
                    elif 'error_rounding' in error_message or 'ERROS DE ARREDONDAMENTO' in error_message:
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro de Arredondamento</h3><p><strong>Problema:</strong> Valores numéricos com problemas de arredondamento foram encontrados.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Verifique os valores numéricos no arquivo, especialmente na coluna H (altura).</p></div>', content_type='text/html; charset=utf-8')
                    
                    # Verificar se é erro de peças com quantidade não inteira
                    elif 'pecas_com_erro' in error_message or 'QUANTIDADES NÃO É INTEIRA' in error_message:
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro de Quantidade de Peças</h3><p><strong>Problema:</strong> Materiais com unidade "PEÇA" devem ter quantidade inteira.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Verifique as quantidades dos materiais com unidade "P" e corrija para números inteiros.</p></div>', content_type='text/html; charset=utf-8')
                    
                    # Verificar se é erro de formatação
                    elif 'Erro de formatação' in error_message or 'não pode ser lido' in error_message:
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro de Formatação do Arquivo</h3><p><strong>Problema:</strong> O arquivo não pôde ser lido ou processado corretamente.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Verifique se o arquivo está no formato correto (.txt ou .xlsx) e se não está corrompido.</p></div>', content_type='text/html; charset=utf-8')
                    
                    # Erro genérico do A1MatList
                    else:
                        return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro na Geração da Lista de Materiais</h3><p><strong>Problema:</strong> Ocorreu um erro durante o processamento dos dados.</p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p><strong>Solução:</strong> Verifique os dados enviados e tente novamente. Se o problema persistir, entre em contato com o suporte técnico.</p></div>', content_type='text/html; charset=utf-8')
                
                # Erro genérico para outras tarefas
                else:
                    return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>❌ Erro na Geração do Arquivo</h3><p><strong>Motivo:</strong></p><pre style="white-space: pre-wrap; background:#fff; border:1px solid #f5c6cb; padding:10px; border-radius:4px;">{error_message}</pre><p>Por favor, verifique os dados enviados e tente novamente.</p></div>', content_type='text/html; charset=utf-8')
            
            file = ospath.normpath(task_result.result).replace('"', '')
            del request.session['task_id']
            
            if ospath.isfile(file):
                report = open(file, 'rb')
                return FileResponse(report, content_type='application/zip')
            else:
                return HttpResponse('<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>Arquivo Não Encontrado</h3><p>O arquivo foi processado mas não foi encontrado no sistema.</p><p>Por favor, tente novamente ou entre em contato com o suporte técnico.</p></div>', content_type='text/html; charset=utf-8')
                
        except TaskResult.DoesNotExist:
            return HttpResponse('<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>Tarefa Não Encontrada</h3><p>A tarefa solicitada não foi encontrada no sistema.</p><p>Por favor, tente novamente.</p></div>', content_type='text/html; charset=utf-8')
        except Exception as e:
            return HttpResponse(f'<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><h3>Erro Inesperado</h3><p><strong>Motivo:</strong> {str(e)}</p><p>Por favor, entre em contato com o suporte técnico.</p></div>', content_type='text/html; charset=utf-8')


class Home(View):
    @login
    def post(self, request):
        return redirect('/app')

    def get(self, request):
        if request.session.get('user_info'):
            del request.session['user_info']
        return render(request, 'geral/EIA1-login.html')


class AppPage(View):
    @verify_user()
    def get(self, request):
        return render(request, 'geral/EIA1-cards.html')

class MyTest(View):

    @verify_user()

    def get(self, request):
        my_card_list = [
            {'card_number': 1, 'content': 'Conteúdo do Card 1'},
            {'card_number': 2, 'content': 'Conteúdo do Card 2'},
            {'card_number': 3, 'content': 'Conteúdo do Card 3'},
            {'card_number': 4, 'content': 'Conteúdo do Card 4'},
        ]

        return render(request, 'geral/myTest.html', {'my_card_list': my_card_list})


class Manual(View):
    @verify_user()
    def get(self, request):
        file = ospath.join(ospath.dirname(ospath.dirname(ospath.abspath(__file__))), 'static',
                            'models',
                            'A1-001-MUT-004 Manual A1 Ferramentas.pdf')
        return FileResponse(open(file, 'rb'), content_type='application/pdf')

from geral.utils import bring_matcode_desc
class Test(View):
    #@verify_user()
    def get(self, request):
        bring_matcode_desc('TTUN4S2EC0B')
        return render(request, 'geral/test.html')


    def post(self, request):
        task = save_task_user_id(go_to_sleep.delay(5, 2))
        request.session['task_id'] = task.task_id
        return JsonResponse({'task_id': task.task_id})


def check_session_active(request):
    last_login = request.session.get('last_login', None)
    if last_login:
        is_authenticated = True
    else:
        is_authenticated = False
    return JsonResponse({'session_active': is_authenticated})


# def get_redis_connection():
#     try:
#         redis_conn = aioredis.from_url("redis://localhost:6379/0")
#         return redis_conn
#     except Exception as e:
#         logger.error("Error connecting to Redis: %s", e, exc_info=True)
#         return None


class TaskListView(View):
    def get(self, request, person_id):
        try:
            # Fetch task results asynchronously
            task_results = get_task_result(person_id) #get_task_result(person_id)
            return JsonResponse({'tasks': task_results})
        except Exception as e:
            logger.error("Error in TaskListConsumer receive: %s", e, exc_info=True)


class TaskResultView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            task_ids = data.get("task_ids", [])
            task_updates = get_task_updates(task_ids)
            qtd_tasks = count_waiting_tasks() #await sync_to_async(count_waiting_tasks)('files_using_dwg')
            # qtd_tasks += count_waiting_tasks('default')
            return JsonResponse({"tasks": task_updates, 'qtd_tasks': qtd_tasks})
        except Exception as e:
            logger.error("Error in TaskResultView: %s", e, exc_info=True)
            return JsonResponse({'error': 'Failed to retrieve task updates'}, status=500)


def get_task_result(person_id):
    max_len_tasks = 30  # Carregar as 30 tarefas mais recentes
    max_tasks_to_keep = 50  # Limite máximo de tasks no banco
    max_tasks_with_files = 20  # Manter arquivos apenas das últimas 20
    
    cache_key = f"task_result_{person_id}"
    cached_result = cache.get(cache_key)
    if cached_result is not None:
        return cached_result
    
    if int(person_id) == 0:
        # retorna os dados totais
        all_tasks_person = TbHistoricTask.objects.all().order_by('-tb_hist_task_id')
        
        # Limitar a 50 tasks no banco (deletaar as mais antigas)
        if all_tasks_person.count() > max_tasks_to_keep:
            tasks_to_delete = all_tasks_person[max_tasks_to_keep:]
            task_ids_to_delete = [t.tb_hist_task_id_task for t in tasks_to_delete]
            TbHistoricTask.objects.filter(tb_hist_task_id_task__in=task_ids_to_delete).delete()
            TaskResult.objects.filter(task_id__in=task_ids_to_delete).delete()
        
        # Deletar arquivos das tasks antigas (manter apenas as últimas 20) base 
        if all_tasks_person.count() > max_tasks_with_files:
            old_tasks_with_files = all_tasks_person[max_tasks_with_files:max_tasks_to_keep]
            for old_task in old_tasks_with_files:
                try:
                    task_result = TaskResult.objects.filter(task_id=old_task.tb_hist_task_id_task).first()
                    if task_result and task_result.result:
                        import os
                        file_path = task_result.result.strip('\"')
                        if os.path.exists(file_path):
                            os.remove(file_path)
                except Exception:
                    pass
        
        all_tasks_person_aux = all_tasks_person[:max_len_tasks]
        dicts_ids_person = {f'{obj_hist_task.tb_hist_task_id_task}': f'{TbPerson.objects.get(pk=obj_hist_task.tb_hist_task_id_person).tb_per_id_ldap}' for obj_hist_task in all_tasks_person_aux}
        list_id_tasks = [task.tb_hist_task_id_task for task in all_tasks_person_aux]
        list_tasks_all = [{'status': task.status, 'result': task.task_id, 'name': task.task_name, 'date_c': task.date_created.strftime('%d-%m-%Y %H:%M:%S'), 'per_name': dicts_ids_person[task.task_id]} for task in TaskResult.objects.filter(task_id__in=list_id_tasks)]
        cache.set(cache_key, list_tasks_all, timeout=15)  # Cache for 10 seconds
        return list_tasks_all
    else:
        # PEga a taks especifica
        person_obj = TbPerson.objects.get(tb_per_id=person_id)
        all_tasks_person = TbHistoricTask.objects.filter(tb_hist_task_id_person=person_obj.pk).order_by('-tb_hist_task_id')
        
        # Limitar a 50 task do usuário no banco (deletar as mais antigas)
        if all_tasks_person.count() > max_tasks_to_keep:
            tasks_to_delete = all_tasks_person[max_tasks_to_keep:]
            task_ids_to_delete = [t.tb_hist_task_id_task for t in tasks_to_delete]
            TbHistoricTask.objects.filter(tb_hist_task_id_task__in=task_ids_to_delete).delete()
            TaskResult.objects.filter(task_id__in=task_ids_to_delete).delete()
            
            # Deletar arquivos das tasks antigas (manter apenas as últimas 20)
            if all_tasks_person.count() > max_tasks_with_files:
                old_tasks_with_files = all_tasks_person[max_tasks_with_files:max_tasks_to_keep]
                for old_task in old_tasks_with_files:
                    try:
                        task_result = TaskResult.objects.filter(task_id=old_task.tb_hist_task_id_task).first()
                        if task_result and task_result.result:
                            import os
                            file_path = task_result.result.strip('"')
                            if os.path.exists(file_path):
                                os.remove(file_path)
                    except Exception:
                        pass
        
        filtered_obj_tasks = [(TaskResult.objects.filter(task_id=i.tb_hist_task_id_task)[0], i.tb_hist_task_id_task) for i in all_tasks_person[:max_len_tasks] if TaskResult.objects.filter(task_id=i.tb_hist_task_id_task)]
        list_tasks_user = [{'status': task.status, 'result': task.task_id, 'name': task.task_name, 'date_c': task.date_created.strftime('%d-%m-%Y %H:%M:%S'), 'per_name': 'Você'} for task, per_name in filtered_obj_tasks[:max_len_tasks]]
        cache.set(cache_key, list_tasks_user, timeout=15)
        return list_tasks_user


def get_task_updates(task_ids):
    # Fetch task results from the database
    tasks = TaskResult.objects.filter(task_id__in=task_ids)
    return [
        {"id": task.task_id, "status": task.status, "progress": (json.loads(task.result).get("percent", 0) if '{' in task.result and '}' in task.result and 'percent' in task.result else 100)}
        for task in tasks if task.result
    ]


redis_pool = redis.ConnectionPool(host='localhost', port=6379, db=0)

def get_redis_connection():
    return redis.Redis(connection_pool=redis_pool)


def count_waiting_tasks():
    redis_conn = get_redis_connection()
    # redis_conn = get_redis_connection()
    if redis_conn:
        pipe = redis_conn.pipeline()
        for queue_name in ['files_using_dwg', 'default']:
            pipe.llen(queue_name)
        queue_lengths = pipe.execute()
        return sum(queue_lengths)
    else:
        return 0
