from .settings import DATABASES
import os
from datetime import date, datetime
from celery import shared_task
# from a1hub.utils import save_task_user_id
from time import sleep

@shared_task(bind=True, name="weba1.utils.dump_db")
def dump_db(self, db_name):
    date_today = date.today()
    new_directory = f"C:\\a1fer\\dump_db\\{date_today}"
    try:
        os.makedirs(new_directory)
    except FileExistsError:
        print("Caminho já existe")
    os.system(f"C:\\a1fer\\backup_db.bat {db_name}  {new_directory}\\{db_name}.sql")
    return f"Backup do banco {db_name} feita com sucesso!"


@shared_task(bind=True, name="weba1.utils.backup_dbs")
def backup_db(self, full=False):
    from a1hub.utils import save_task_user_id
    dbs_not_backup = ['msys_db', 'intranet_db', 'a1flx_db']

    if full: # backup incluindo a1flex_db
        dbs_not_backup.remove('a1flx_db')

    list_db_name = list(DATABASES.keys())
    #faz o backup de todos os bancos exceto mysql_db e intranet_db, o banco do a1flx_db faz unicamente na sexta-feira
    for db_name in list_db_name:
        if db_name not in dbs_not_backup:
            save_task_user_id(dump_db.delay(DATABASES[db_name].get("NAME")))
        else:
            # If today is Friday (0 = Mon, 1 = Tue, 2 = Wen ...)
            if (datetime.today().weekday() == 4) and (db_name == 'a1flx_db'):
                save_task_user_id(dump_db.delay(DATABASES[db_name].get("NAME")))

# --------------------------------------------------------
# Tasks de teste para o Signal de monitoramento.
@shared_task(queue='files_using_dwg') # Usando a fila que você já configurou
def debug_success_task(seconds):
    print(f"--> [Worker] Processando por {seconds} segundos...")
    sleep(seconds)
    return "Teste concluído com sucesso!"

# Task que vai dar ERRO
@shared_task(queue='files_using_dwg')
def debug_fail_task():
    print("--> [Worker] Vou falhar agora...")
    sleep(2)
    raise ValueError("Erro simulado para teste do Signal!")