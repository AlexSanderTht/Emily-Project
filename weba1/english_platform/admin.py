from django.contrib import admin

from .models import ContactLead, LessonBooking


@admin.register(ContactLead)
class ContactLeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)


@admin.register(LessonBooking)
class LessonBookingAdmin(admin.ModelAdmin):
    list_display = ('student', 'scheduled_at', 'level', 'status')
    search_fields = ('student__username', 'student__email', 'goals')
    list_filter = ('status', 'level', 'scheduled_at')
