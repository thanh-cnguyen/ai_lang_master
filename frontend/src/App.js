// frontend/src/App.js
import React, { useState } from 'react';
import ChatBubble from './components/ChatBubble';
import ChatContainer from './components/ChatContainer';
import './styles/base.scss';
import './styles/ChatBubble.scss';
import './utils/fetchInterceptor';

function App() {
  const [chatStarted, setChatStarted] = useState(false);

  const handleChatStart = () => {
    setChatStarted(true);
  };

  return (
    <div className="App">
      {chatStarted ? <ChatContainer /> : <ChatBubble onChatStart={handleChatStart} />}
    </div>
  );
}

export default App;