"""
Módulo: celery_utils.py

Descrição:
    Este módulo atua como um "interceptador" de eventos do Celery.
    Ele utiliza o sistema de Sinais (Signals) para atualizar o banco de dados
    Django (tabela TbQueueTaskCelery) automaticamente sempre que uma tarefa
    muda de estado no Worker.

Fluxo monitorado:
    PENDING (View) → STARTED (Worker) → SUCCESS/FAILURE (Worker)

Observações:
    - É importante importar esse modulo na view mesmo o uso sendo implicito.
"""

import logging
from celery.signals import task_prerun, task_postrun, task_failure
from django.utils import timezone

# Configura o logger para que as mensagens saiam no terminal do Worker (CMD)
# Isso permite ver logs com a tag [PAINEL] misturados aos logs do Celery.
logger = logging.getLogger("celery")


@task_prerun.connect
def task_started_handler(sender=None, task_id=None, task=None, **kwargs):
    """
    Sinal: task_prerun
    Gatilho: Disparado imediatamente ANTES do worker começar a executar a função da task.

    Ação:
        1. Busca o registro da task no banco (criado anteriormente pela View).
        2. Atualiza status para 'STARTED'.
        3. Registra o horário de início.
        4. Tenta capturar o nome da fila (queue) real do worker.
    """
    # IMPORTANTE: Lazy Import (Importação Tardia)
    # O model é importado dentro da função para evitar o erro "AppRegistryNotReady".
    # Se importasse no topo, o Celery tentaria carregar o banco antes do Django estar pronto.
    from eletrica.models import TbQueueTaskCelery
    try:
        monitor = TbQueueTaskCelery.objects.get(task_id=task_id)
        monitor.status = 'STARTED'
        monitor.started_at = timezone.now()

        if task and hasattr(task, 'queue'):
            monitor.worker_queue = task.queue

        monitor.save()
        logger.info(f"===> [PAINEL] Task {task_id} mudou para STARTED.")

    except TbQueueTaskCelery.DoesNotExist:
        pass
    except Exception as e:
        logger.error(f"===> [PAINEL] Erro ao registrar START: {e}")


@task_postrun.connect
def task_finished_handler(sender=None, task_id=None, task=None, retval=None, state=None, **kwargs):
    """
    Sinal: task_postrun
    Gatilho: Disparado APÓS a task terminar com sucesso (sem exceções).

    Ação:
        1. Atualiza status para 'SUCCESS'.
        2. Registra horário de término.
        3. Salva o retorno (return) da função na coluna 'result'.
    """
    from eletrica.models import TbQueueTaskCelery
    try:
        monitor = TbQueueTaskCelery.objects.get(task_id=task_id)
        monitor.status = 'SUCCESS'
        monitor.finished_at = timezone.now()

        # Trunca resultados muito grandes para não estourar o banco
        result_str = str(retval)
        if len(result_str) > 5000:
            result_str = result_str[:5000] + "..."

        monitor.result = result_str
        monitor.save()
        logger.info(f"===> [PAINEL] Task {task_id} mudou para SUCCESS.")

    except TbQueueTaskCelery.DoesNotExist:
        pass
    except Exception as e:
        logger.error(f"===> [PAINEL] Erro ao registrar SUCCESS: {e}")


@task_failure.connect
def task_failure_handler(sender=None, task_id=None, exception=None, **kwargs):
    """
    Sinal: task_failure
    Gatilho: Disparado se a task lançar qualquer Exceção não tratada.

    Ação:
        1. Atualiza status para 'FAILURE'.
        2. Registra horário de término.
        3. Salva a mensagem de erro (Traceback/Exception) na coluna 'result'.
    """
    from eletrica.models import TbQueueTaskCelery
    try:
        monitor = TbQueueTaskCelery.objects.get(task_id=task_id)
        monitor.status = 'FAILURE'
        monitor.finished_at = timezone.now()
        monitor.result = str(exception)
        monitor.save()
        logger.warning(f"===> [PAINEL] Task {task_id} mudou para FAILURE.")

    except TbQueueTaskCelery.DoesNotExist:
        pass
