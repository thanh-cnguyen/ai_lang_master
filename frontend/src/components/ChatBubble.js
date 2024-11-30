// frontend/src/components/ChatBubble.js
import React from 'react';

const ChatBubble = ({ onChatStart }) => {
  return (
    <div className="chat-bubble" onClick={onChatStart}>
      <div className="greeting">Hi, User 👋</div>
      <div className="prompt">Tap to chat</div>
      <div className="icon">🎤</div>
    </div>
  );
};

export default ChatBubble;