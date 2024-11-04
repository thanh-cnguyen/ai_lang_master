import React, {useState, useEffect, useRef} from 'react'

const ChatContainer = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(scrollToBottom, [messages])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const sendMessage = async () => {
    if (input.trim() === '') return

    const userMessage = {text: input, sender: 'User'}
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInput('')

    fetch('/chatbot/generate-response/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: input}),
    }).then(response => response.json()).then((data) => {
      const aiMessage = {text: data.message, sender: 'AI Tutor'}
      setMessages(prevMessages => [...prevMessages, aiMessage])
    }).catch((error) =>{
      console.error('Error sending message:', error)
      const errorMessage = {text: 'Sorry, there was an error processing your request.', sender: 'System'}
      setMessages(prevMessages => [...prevMessages, errorMessage])
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="chat-container" style={styles.container}>
      <div className="messages" style={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} style={message.sender === 'User' ? styles.userMessage : styles.aiMessage}>
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area" style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  messages: {
    height: '400px',
    overflowY: 'auto',
    padding: '10px',
  },
  userMessage: {
    backgroundColor: '#e6f2ff',
    padding: '5px 10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '5px 15px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
}

export default ChatContainer
