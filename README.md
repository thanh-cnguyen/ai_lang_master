AI Language Master

Project Overview
-----------------
AI Language Master is an interactive conversational AI platform designed to help people globally learn new languages. By simulating natural, real-world conversations, our goal is to provide an immersive, user-friendly environment where learners can practice and improve their language skills at their own pace. With real-time feedback on grammar, vocabulary, and contextual usage, learners can engage in meaningful dialogue without the fear of public judgment.

Tejas Pinjala: Frontend development, Chat features, Prompt engineering, AI model fine-tuning, Dataset creation.
Thanh Nguyen: Backend integration with Django, GPT model implementation, API endpoint development.
Faizul Anis: Model debugging & testing, full-stack development, Windows-Mac model conversion, compatibility assurance, surveyed participants and documentation.

Instructor
Tatiana Erekhinskaya, CS 6320.002, Fall 2024

Technologies Used
Frontend: HTML, CSS, JavaScript, React
Backend: Django, Python
AI: GPT-4, Prompt engineering, Model fine-tuning
Docker: Containerization for seamless integration of frontend, backend, and AI models

Installation

Prerequisites
Docker
Python 3.8+
Django

Steps
1. Clone the repository:
   git clone https://github.com/thanh-cnguyen/ai_lang_master
2. Navigate to the project directory:
   cd ai-language-master
3. Build the Docker containers:
   docker-compose build
4. Start the application:
   docker-compose up
5. Visit http://localhost:3000 in your web browser to start using the AI chatbot.

Usage
Chat with the AI
Once the app is running, you can interact with the chatbot by typing or speaking. It will provide contextual responses based on your input.

Real-Time Feedback
The AI offers grammatical corrections and vocabulary suggestions to help you learn more effectively during the conversation.

Test and Evaluate
After interacting with the AI, complete the survey to provide feedback on the application’s effectiveness and usability. Your input will help us improve the platform.

Challenges & Solutions
Selecting the Right AI Model: After testing several pre-built models, GPT-4 Mini was selected due to its efficiency and contextual accuracy. Fine-tuning was applied to adapt it for language learning conversations.
Off-Topic Responses: We used advanced prompt engineering to guide the model’s focus and ensure that it remained on topic during interactions.
Integration Issues: Docker was used to manage development environments, and rigorous testing was done to ensure smooth integration of frontend, backend, and AI components.

Future Work
Expanded Language Support: We plan to support more languages, including Chinese, and refine the chatbot’s cultural adaptability.
Enhanced Feedback: We aim to integrate pronunciation and grammatical analysis features.
Immersive Learning: Future versions will explore integrating VR/AR components to simulate real-world scenarios for practice.

References
Mariani, Marcello M., et al. "Artificial Intelligence Empowered Conversational Agents: A Systematic Literature Review and Research Agenda." *Journal of Business Research*, Elsevier, 21 Mar. 2023, www.sciencedirect.com/science/article/pii/S0148296323001960.
Chen, Kaiping, et al. "Conversational AI and Equity through Assessing GPT-3’s Communication with Diverse Social Groups on Contentious Topics." *Nature News*, Nature Publishing Group, 18 Jan. 2024, www.nature.com/articles/s41598-024-51969-w.
"Conversational AI: An Overview of Methodologies, Applications & Future Scope." *IEEE Conference Publication*, IEEE Xplore, ieeexplore.ieee.org/document/9129347/. Accessed 2 Dec. 2024.
LeewayHertz. "How to Train a GPT Model: A Comprehensive Guide." , Javarevisited, 8 Aug. 2023, medium.com/javarevisited/how-to-train-a-gpt-model-a-comprehensive-guide-cd77d8db2693.
"Models - Hugging Face," huggingface.co/models. Accessed 2 Dec. 2024.
OpenAI API Reference, platform.openai.com/docs/api-reference/introduction. Accessed 2 Dec. 2024.
