import React, {useEffect, useRef, useState} from 'react'
import {nameMap} from '../utils/constants'

const ChatContainer = () => {
  const [messages, setMessages] = useState([{
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    name: 'AI Tutor',
  }])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})

  const sendMessage = () => {
    if (input.trim() === '') return

    const userMessage = {content: input, role: 'user', name: 'User'}
    setMessages((prevMessages) => [...prevMessages, userMessage])

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({new_message: input}))
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: 'Connection lost. Please try again.',
          role: 'error',
          name: 'System',
        },
      ])
    }

    setInput('')
  }

  const handleInputChange = (e) => setInput(e.target.value)

  const handleKeyPress = (e) => e.key === 'Enter' && sendMessage()

  const resetChat = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({new_message: 'reset'}))
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: 'Connection lost. Please try again.',
          role: 'system',
          name: 'System',
        },
      ]);
    }
  };

  useEffect(() => {
    const url = 'ws://localhost:8000/ws/streaming-chat/'
    socketRef.current = new WebSocket(url)

    socketRef.current.onopen = () => console.log('WebSocket connection established')

    socketRef.current.onmessage = (e) => {
      const {content, role, is_complete} = JSON.parse(e.data)

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1]

        if (role === 'assistant') {
          if (!is_complete) {
            if (lastMessage && lastMessage.role === role && !lastMessage.is_complete) {
              // Replace the content of the last incomplete assistant message
              const updatedMessage = {
                ...lastMessage,
                content: content, // Replace with the new cumulative content
              }
              return [...prevMessages.slice(0, -1), updatedMessage]
            } else {
              // Start a new assistant message
              const newMessage = {
                content: content,
                role: role,
                name: nameMap[role],
                is_complete: is_complete,
              }
              return [...prevMessages, newMessage]
            }
          } else if (is_complete && content === '') {
            if (lastMessage && lastMessage.role === role && !lastMessage.is_complete) {
              // Mark the last assistant message as complete
              const updatedMessage = {...lastMessage, is_complete: true}
              return [...prevMessages.slice(0, -1), updatedMessage]
            }
            // No action needed if there's no incomplete assistant message
            return prevMessages
          }
        } else if (role === 'error') {
          // Handle error messages by adding a new system message
          const errorMessage = {
            content: content,
            role: role,
            name: nameMap[role],
            is_complete: true,
          }
          return [...prevMessages, errorMessage]
        } else if (role === 'system' && content === 'reset') {
          return [{
            content: 'Hello! How can I help you today?',
            role: 'assistant',
            name: 'AI Tutor',
          }]
        }

        // For any other roles, return the previous state unmodified
        return prevMessages
      })
    }

    socketRef.current.onclose = (e) => {
      console.log('WebSocket closed:', e)
      console.log('Code:', e.code)
      console.log('Reason:', e.reason)
    }

    socketRef.current.onerror = (error) => console.error(`WebSocket error: ${error}`)

    return () => socketRef.current?.close()
  }, [])

  useEffect(scrollToBottom, [messages])

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'user-message' : 'ai-message'}>
            <strong>{message.name}:</strong> {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <button className='button-voice'>Voice</button>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className='input'
        />
        <button onClick={sendMessage} className='button-send'>Send</button>
        <button onClick={resetChat} className='button-reset'>Reset</button>
      </div>
    </div>
  )
}

export default ChatContainer
