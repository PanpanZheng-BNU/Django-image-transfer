from django import forms
from django.forms import widgets


class UploadImageForm(forms.Form):
    name = forms.CharField(widget=widgets.TextInput(attrs={'class': 'form-control'}))
    image_fields = forms.ImageField()
