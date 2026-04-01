from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import ContactLeadForm, LessonBookingForm, StudentLoginForm, StudentRegisterForm
from .models import LessonBooking


class EnglishLandingView(View):
    template_name = 'english_platform/landing.html'

    def get(self, request):
        context = {
            'lead_form': ContactLeadForm(),
        }
        return render(request, self.template_name, context)

    def post(self, request):
        lead_form = ContactLeadForm(request.POST)
        if lead_form.is_valid():
            lead_form.save()
            messages.success(request, 'Recebemos seu interesse. Em breve entraremos em contato!')
            return redirect('english_platform:landing')

        context = {
            'lead_form': lead_form,
        }
        return render(request, self.template_name, context)


class StudentRegisterView(View):
    template_name = 'english_platform/register.html'

    def get(self, request):
        return render(request, self.template_name, {'form': StudentRegisterForm()})

    def post(self, request):
        form = StudentRegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email', '').lower()
            if User.objects.filter(email=email).exists():
                form.add_error('email', 'Este e-mail ja esta em uso.')
            else:
                user = form.save(commit=False)
                user.email = email
                user.save()
                login(request, user)
                messages.success(request, 'Cadastro realizado com sucesso. Bem-vindo(a)!')
                return redirect('english_platform:dashboard')

        return render(request, self.template_name, {'form': form})


class StudentLoginView(LoginView):
    template_name = 'english_platform/login.html'
    authentication_form = StudentLoginForm

    def get_success_url(self):
        return reverse_lazy('english_platform:dashboard')


class StudentLogoutView(View):
    def post(self, request):
        logout(request)
        messages.info(request, 'Sessao encerrada com sucesso.')
        return redirect('english_platform:landing')


class DashboardView(LoginRequiredMixin, View):
    template_name = 'english_platform/dashboard.html'
    login_url = reverse_lazy('english_platform:login')

    def get(self, request):
        bookings = LessonBooking.objects.filter(student=request.user).order_by('scheduled_at')
        context = {
            'bookings': bookings,
            'form': LessonBookingForm(),
        }
        return render(request, self.template_name, context)


class BookingCreateView(LoginRequiredMixin, View):
    login_url = reverse_lazy('english_platform:login')

    def post(self, request):
        form = LessonBookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.student = request.user
            booking.save()
            messages.success(request, 'Aula solicitada. Aguarde a confirmacao!')
        else:
            messages.error(request, 'Nao foi possivel agendar. Revise os campos e tente novamente.')
        return redirect('english_platform:dashboard')
