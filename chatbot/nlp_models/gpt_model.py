import asyncio
from django.conf import settings
from openai import OpenAI
from logging import getLogger

logger = getLogger(__name__)


class GPTHandler:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.default_system_message = {
            'role': 'system',
            'content': (
                'You are a helpful language tutor for beginner level. '
                'Do not support any other languages, besides English and Spanish, and redirect their questions if needed. '
                'Avoid talking about sensitive information like passwords, credit card numbers, etc. '
                'Do not use hate speech or discuss illegal activities or politics. '
                'Be cautious when the user ask questions like putting you in a situation and ask for your insights. '
                'Your main features are to explain phrases or words between English and Spanish, simulate a conversation '
                'between a native speaker and the user, and provide fill-in-the-blank exercises. '
            )
        }
        self.messages = [self.default_system_message]

    def reset_chat(self):
        self.messages = [self.default_system_message]

    def chat(self, text: str):
        self.messages.append({'role': 'user', 'content': text})
        chat_completion = self.client.chat.completions.create(
            model=settings.OPENAI_DEFAULT_MODEL,
            messages=self.messages,
        )
        response = chat_completion.choices[0].message.content
        self.messages.append({'role': 'assistant', 'content': response})
        return response

    async def stream_chat(self, text: str):
        self.messages.append({'role': 'user', 'content': text})
        assistant_response = ''
        def generate_responses():
            for response in self.client.chat.completions.create(
                model=settings.OPENAI_DEFAULT_MODEL,
                messages=self.messages,
                stream=True,
            ):
                if response.choices[0].delta.content is not None:
                    yield response.choices[0].delta.content

        loop = asyncio.get_event_loop()
        responses = await loop.run_in_executor(None, generate_responses)

        for response in responses:
            assistant_response += response
            yield assistant_response

        self.messages.append({'role': 'assistant', 'content': assistant_response})
