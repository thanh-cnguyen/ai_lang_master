from django.urls import path
from django.views.generic import TemplateView
from chatbot.views import chat

urlpatterns = [
    path('api/chat/', chat, name='chat'),
    path('', TemplateView.as_view(template_name="chatbot_home.html"), name="chatbot_home"),
]
