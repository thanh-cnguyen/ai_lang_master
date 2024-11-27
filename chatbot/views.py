import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .nlp_models.chatbot import Chatbot
from logging import getLogger

logger = getLogger(__name__)

# Create your views here.
chatbot = Chatbot()

@csrf_exempt
def generate_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message')
        if not message:
            return JsonResponse({'message': 'Invalid message'})
        response = chatbot.process_input(message)
        return JsonResponse({'content': response, 'role': 'bot'})
    return HttpResponse('Invalid request method')
