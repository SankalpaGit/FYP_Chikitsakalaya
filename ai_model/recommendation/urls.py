# recommendation/urls.py

from django.urls import path
from .views import recommend_doctors_api

urlpatterns = [
    path('recommend/', recommend_doctors_api, name='recommend_doctors_api'),
]
