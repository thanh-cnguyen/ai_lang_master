import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .nlp_models.chatbot import Chatbot

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.chatbot = Chatbot()
        print("WebSocket connection established")

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):
        if not text_data.strip():
            await self.send(text_data=json.dumps({
                'content': 'Empty message received',
                'role': 'error',
            }))
            return

        try:
            # Parse JSON input
            text_data_json = json.loads(text_data)
            message = text_data_json['new_message']

            if not message:
                # If no 'message' key is present, respond with an error
                await self.send(text_data=json.dumps({
                    'content': 'Invalid message format',
                    'role': 'error',
                }))
                return

            # Process the message with your chatbot logic
            response = self.chatbot.process_input(message)

            # Send the chatbot's response back to the client
            await self.send(text_data=json.dumps({
                'content': response,
                'role': 'assistant',
            }))
        except json.JSONDecodeError:
            # Handle invalid JSON format
            await self.send(text_data=json.dumps({
                'content': 'Malformed JSON received',
                'role': 'error',
            }))

class StreamingChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.chatbot = Chatbot()
        print("WebSocket connection established")

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['new_message']

        try:
            async for response_chunk in self.chatbot.process_input_stream(message):
                try:
                    # Send the response chunk to the client
                    await self.send(text_data=json.dumps({
                        'content': response_chunk,
                        'role': 'assistant',
                        'is_complete': False
                    }))
                except Exception as send_error:
                    print(f"Error during message sending: {send_error}")
                    break
        except Exception as e:
            print(f'StreamingChatConsumer - receive() | An error occurred during message processing: {e}')
            await self.send(text_data=json.dumps({
                'content': 'An error occurred. Please try again later.',
                'role': 'error',
                'is_complete': True
            }))
            await self.close()
            return

        # Send a final message to indicate the end of the stream
        await self.send(text_data=json.dumps({
            'content': '',
            'role': 'assistant',
            'is_complete': True
        }))
