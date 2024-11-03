import {useState} from 'react'
import axios from 'axios'

function ChatComponent() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    try {
      const response = await axios.post('api/chat/', {
        message: input,
        source_lang: 'en',
        target_lang: 'es'
      })
      setMessages([...messages, {user: input, bot: response.data.response}])
      setInput('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>User: {msg.user}</p>
            <p>Bot: {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatComponent
