from django.urls import path, include
from django.contrib import admin
from django.views.generic import RedirectView
urlpatterns = [
    path('', RedirectView.as_view(pattern_name='english_platform:landing', permanent=False), name='home'),
    path('english/', include('english_platform.urls', namespace='english_platform')),
    path('admin/', admin.site.urls),
]
