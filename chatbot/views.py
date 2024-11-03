from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .nlp_models.chatbot import Chatbot

# Create your views here.
chatbot = Chatbot()

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        message = request.POST.get('message', '')
        source_lang = request.POST.get('source_lang')
        target_lang = request.POST.get('target_lang')
        response = chatbot.process_input(message, source_lang, target_lang)
        return JsonResponse({'response': response})
    return HttpResponse('Invalid request method')