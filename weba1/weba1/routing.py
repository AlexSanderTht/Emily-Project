from .consumers import TaskResultConsumer, TaskListConsumer
from django.urls import path, include
from django.conf import settings


websocket_urlpatterns = [
    path('ws/task-list/<str:person_id>/', TaskListConsumer.as_asgi()),
    path('ws/task-progress/', TaskResultConsumer.as_asgi()),
]
