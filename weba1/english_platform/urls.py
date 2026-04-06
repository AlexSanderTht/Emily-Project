from django.urls import path

from .views import (
    BookingCreateView,
    DashboardView,
    EnglishLandingView,
    StudentLoginView,
    StudentLogoutView,
    StudentRegisterView,
)

app_name = 'english_platform'

urlpatterns = [
    path('', EnglishLandingView.as_view(), name='landing'),
    path('cadastro/', StudentRegisterView.as_view(), name='register'),
    path('entrar/', StudentLoginView.as_view(), name='login'),
    path('sair/', StudentLogoutView.as_view(), name='logout'),
    path('painel/', DashboardView.as_view(), name='dashboard'),
    path('agendar/', BookingCreateView.as_view(), name='book_lesson'),
]
