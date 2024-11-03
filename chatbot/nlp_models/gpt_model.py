from transformers import GPT2LMHeadModel, GPT2Tokenizer

class GPTHandler:
    def __init__(self):
        self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
        self.model = GPT2LMHeadModel.from_pretrained('gpt2')

    def generate_response(self, input_ids, attention_mask):
        outputs = self.model.generate(input_ids=input_ids, attention_mask=attention_mask, max_length=50)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
