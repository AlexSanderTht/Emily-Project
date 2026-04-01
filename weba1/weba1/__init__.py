from __future__ import absolute_import, unicode_literals

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery_setup import app as celery_app
celery_app.autodiscover_tasks(None, related_name='aniv')
celery_app.autodiscover_tasks(None, related_name='import_lote_civ')
__all__ = ('celery_app',)
efault_app_config = 'weba1.apps.Weba1Config'
# Permite usar PyMySQL como MySQLdb
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except Exception:
    pass
