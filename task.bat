@echo off
start  "celery_default" cmd /k "cd /d C:\EIA1Project\venv\Scripts && activate && cd /d C:\EIA1Project\htdocs\eia1ferramentas\weba1\ && celery -A weba1 purge -Q default --force && celery -A weba1 worker -Q default -l info -n worker_default@%h --concurrency 50 -P threads "
start "celery_files_dwg" cmd /k "cd /d C:\EIA1Project\venv\Scripts && activate && cd /d C:\EIA1Project\htdocs\eia1ferramentas\weba1\ && celery -A weba1 purge -Q files_using_dwg --force && celery -A weba1 worker -Q files_using_dwg -l info -n worker_files_dwg@%h --concurrency 1 -P solo "

