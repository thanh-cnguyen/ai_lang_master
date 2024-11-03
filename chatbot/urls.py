from django.urls import path
from chatbot.views import generate_response

urlpatterns = [
    path('generate-response/', generate_response, name='generate_response'),
]
