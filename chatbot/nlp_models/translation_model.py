from transformers import MarianMTModel, MarianTokenizer

class TranslationHandler:
    def __init__(self):
        self.model_name = 'Helsinki-NLP/opus-mt-en-ROMANCE'
        self.tokenizer = MarianTokenizer.from_pretrained(self.model_name)
        self.model = MarianMTModel.from_pretrained(self.model_name)

    def translate(self, text, target_lang):
        inputs = self.tokenizer(text, return_tensors="pt")
        outputs = self.model.generate(**inputs, forced_bos_token_id=self.tokenizer.lang_code_to_id[target_lang])
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
