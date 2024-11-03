from .bert_model import BERTHandler
from .gpt_model import GPTHandler
from .translation_model import TranslationHandler

class Chatbot:
    def __init__(self):
        self.bert = BERTHandler()
        self.gpt = GPTHandler()
        self.translator = TranslationHandler()

    def process_input(self, text, source_lang, target_lang):
        # Encode input using BERT
        encoded_input = self.bert.encode_input(text)

        # Generate response using GPT
        response = self.gpt.generate_response(encoded_input, None)  # Simplified for brevity

        # Translate response if necessary
        if source_lang != target_lang:
            response = self.translator.translate(response, target_lang)

        return response
