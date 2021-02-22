import os
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from .forms import *
from PIL import Image
from Transfer_Picture import settings


# Create your views here.

def upload_file(request):
    form = UploadImageForm()
    request.encoding = 'utf-8'
    return render(request, 'index.html', {'form': form})


def image_transfer(request):
    if request.is_ajax and request.method == "POST":

        img_direction = 'img'
        file_path = os.path.join(settings.MEDIA_ROOT, img_direction)
        if not os.path.exists(file_path):
            os.makedirs(file_path)

        file_name = request.POST["filename"].strip().replace(" ", "_")
        img = Image.open(request.FILES['img'])
        img = img.convert("L")
        img.save(os.path.join(file_path, file_name))

        return JsonResponse({'post': request.POST, 'imgPath': os.path.join("/media",img_direction,file_name)}, status=200)