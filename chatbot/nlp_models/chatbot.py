from .gpt_model import GPTHandler


class Chatbot:
    def __init__(self):
        self.gpt = GPTHandler()

    def process_input(self, text: str):
        # Generate response using GPT
        return self.gpt.chat(text)

    async def process_input_stream(self, text: str):
        # Generate response using GPT
        async for resp_chunk in self.gpt.stream_chat(text):
            yield resp_chunk