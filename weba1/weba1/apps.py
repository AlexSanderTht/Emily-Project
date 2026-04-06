from django.apps import AppConfig

class Weba1Config(AppConfig):
    name = 'weba1'
    verbose_name = 'Web A1'

    def ready(self):
        # Importa o arquivo que acabamos de criar
        import weba1.celery_utils
