from django.conf import settings
from django.db import models


class ContactLead(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.email})'


class LessonBooking(models.Model):
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'

    LEVEL_CHOICES = [
        (BEGINNER, 'Iniciante'),
        (INTERMEDIATE, 'Intermediario'),
        (ADVANCED, 'Avancado'),
    ]

    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    DONE = 'done'
    CANCELED = 'canceled'

    STATUS_CHOICES = [
        (PENDING, 'Pendente'),
        (CONFIRMED, 'Confirmada'),
        (DONE, 'Concluida'),
        (CANCELED, 'Cancelada'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default=BEGINNER)
    goals = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_at']

    def __str__(self):
        return f'{self.student} - {self.scheduled_at:%d/%m/%Y %H:%M}'
