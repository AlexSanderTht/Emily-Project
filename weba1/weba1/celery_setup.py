from __future__ import absolute_import, unicode_literals

from time import sleep
import os
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')
from celery import Celery, Task
from django.apps import apps
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weba1.settings')
app = Celery('weba1')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object(settings, namespace='CELERY')

# Explicitly set worker_state_db to resolve the KeyError
app.conf.worker_state_db = None

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(['weba1'], force=True)
#app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


