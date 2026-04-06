import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django_celery_results.models import TaskResult
from a1hub.models import TbPerson, TbHistoricTask
from celery import current_app
from datetime import datetime, date
import pdb
import logging
import redis

logger = logging.getLogger("channels")


try:
    r = redis.Redis(host='localhost', port=6379, db=0)
except redis.ConnectionError as e:
    print("Error connecting to Redis:", e)
    r = None  # Set to None if connection fails, handle appropriately in functions
    logger.error("Error in Redis: %s", e, exc_info=True)


class TaskListConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.person_id = 0

    async def connect(self):

        try:

            print('Entrou no consumer')
            self.person_id = self.scope['url_route']['kwargs']['person_id']
            await self.accept()
        except Exception as e:
            logger.error("Error in TaskListConsumer connect: %s", e, exc_info=True)

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            # Fetch task results asynchronously
            task_results = await sync_to_async(self.get_task_result)() #await sync_to_async(self.get_task_result)()
            #
            # print(task_results)
            # # # Send the results back through the WebSocket connection
            # if task_results:
            #     # tasks_data = [
            #     #     {'task_id': task.task_id, 'status': task.status}
            #     #     for task in task_results
            #     # ]
            await self.send(text_data=json.dumps({
                'tasks': task_results
            }))
        except Exception as e:
            logger.error("Error in TaskListConsumer receive: %s", e, exc_info=True)

    def get_task_result(self):
        max_len_tasks = 15
        if int(self.person_id) == 0:
            # Return a limited number of tasks for all users
            all_tasks_person = TbHistoricTask.objects.all().order_by('-tb_hist_task_id')
            all_tasks_person_aux = all_tasks_person[:max_len_tasks]
            dicts_ids_person = {f'{obj_hist_task.tb_hist_task_id_task}': f'{TbPerson.objects.get(pk=obj_hist_task.tb_hist_task_id_person).tb_per_id_ldap}' for obj_hist_task in all_tasks_person_aux}
            list_id_tasks = [task.tb_hist_task_id_task for task in all_tasks_person_aux]
            list_tasks_all = [{'status': task.status, 'result': task.task_id, 'name': task.task_name, 'date_c': task.date_created.strftime('%d-%m-%Y %H:%M:%S'), 'per_name': dicts_ids_person[task.task_id]} for task in TaskResult.objects.filter(task_id__in=list_id_tasks)]
            return list_tasks_all
        else:
            # Get tasks specific to a person
            person_obj = TbPerson.objects.get(tb_per_id=self.person_id)
            all_tasks_person = TbHistoricTask.objects.filter(tb_hist_task_id_person=person_obj.pk)
            filtered_obj_tasks = [(TaskResult.objects.filter(task_id=i.tb_hist_task_id_task)[0], i.tb_hist_task_id_task) for i in all_tasks_person.order_by('-tb_hist_task_id')[:max_len_tasks] if TaskResult.objects.filter(task_id=i.tb_hist_task_id_task)]
            list_tasks_user = [{'status': task.status, 'result': task.task_id, 'name': task.task_name, 'date_c': task.date_created.strftime('%d-%m-%Y %H:%M:%S'), 'per_name': 'Você'} for task, per_name in filtered_obj_tasks[:max_len_tasks]]
            return list_tasks_user


class TaskResultConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()
        except Exception as e:
            logger.error("Error in TaskResultConsumer connect: %s", e, exc_info=True)

    async def receive(self, text_data):
        try:
            request_data = json.loads(text_data)
            data = json.loads(text_data)
            task_ids = data.get("task_ids", [])
            task_updates = await sync_to_async(self.get_task_updates)(task_ids)
            try:
                qtd_tasks = await sync_to_async(self.count_waiting_tasks)('files_using_dwg')
                qtd_tasks += await sync_to_async(self.count_waiting_tasks)('default')
            except:
                qtd_tasks = 0
            await self.send(text_data=json.dumps({"tasks": task_updates, 'qtd_tasks': qtd_tasks}))
            # if request_data.get('request') == 'task_list':
            #     tasks = await sync_to_async(self.get_task_updates)()
            #     await self.send(text_data=json.dumps({'tasks': tasks}))
        except Exception as e:
            logger.error("Error in TaskResultConsumer recive: %s", e, exc_info=True)

    def get_task_updates(self, task_ids):
        # Fetch task results from the database
        tasks = TaskResult.objects.filter(task_id__in=task_ids)
        return [
            {"id": task.task_id, "status": task.status, "progress": (json.loads(task.result).get("percent", 0) if '{' in task.result and '}' in task.result and 'percent' in task.result else 100)}
            for task in tasks if task.result
        ]

    def count_waiting_tasks(self, queue_name):
        global r
        if r:
            queue_length = r.llen(queue_name)
            if queue_length:
                return queue_length
            else:
                return 0
        else:
            return 1
