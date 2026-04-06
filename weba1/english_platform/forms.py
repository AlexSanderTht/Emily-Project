from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

from .models import ContactLead, LessonBooking


class ContactLeadForm(forms.ModelForm):
    class Meta:
        model = ContactLead
        fields = ['name', 'email', 'phone', 'message']


class StudentRegisterForm(UserCreationForm):
    first_name = forms.CharField(max_length=150)
    last_name = forms.CharField(max_length=150)
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password1', 'password2']


class StudentLoginForm(AuthenticationForm):
    username = forms.CharField(label='Usuario ou e-mail')

    def clean(self):
        username = self.cleaned_data.get('username', '')
        if '@' in username:
            user = User.objects.filter(email__iexact=username).first()
            if user:
                self.cleaned_data['username'] = user.username
        return super().clean()


class LessonBookingForm(forms.ModelForm):
    scheduled_at = forms.DateTimeField(
        label='Data e hora da aula',
        input_formats=['%Y-%m-%dT%H:%M'],
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M')
    )

    class Meta:
        model = LessonBooking
        fields = ['scheduled_at', 'level', 'goals']
        labels = {
            'level': 'Seu nivel atual',
            'goals': 'Objetivos com o ingles',
        }
        widgets = {
            'goals': forms.Textarea(attrs={'rows': 4}),
        }
