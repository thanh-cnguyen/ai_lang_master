/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import {nameMap} from '../utils/constants'

const ChatContainer = () => {
  const [messages, setMessages] = useState([{
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    name: 'AI Tutor',
  }])
  const [input, setInput] = useState('')
  const [voiceActivated, setVoiceActivated] = useState(false)
  const [isManuallyStopped, setIsManuallyStopped] = useState(false)
  const [waitingForVoiceResponse, setWaitingForVoiceResponse] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

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
      ])
    }
  }

  const startListening = () => {
    setVoiceActivated(true)
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use a supported browser.')
    } else {
      resetTranscript()
      setWaitingForVoiceResponse(false)
      SpeechRecognition.startListening({continuous: false})
    }
  }

  const stopListening = () => {
    setVoiceActivated(false)
    setIsManuallyStopped(true)
    SpeechRecognition.stopListening()
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      // Select a voice (optional)
      const voices = window.speechSynthesis.getVoices()
      const selectedVoice = voices.find(voice => voice.name === 'Google US English') || voices[0]
      utterance.voice = selectedVoice
      utterance.pitch = 1
      utterance.rate = 1

      utterance.onend = () => {
        console.log('Speech synthesis completed.')
      }

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e.error)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: 'Speech synthesis failed. Please try again.',
            role: 'error',
            name: 'System',
          },
        ])
      }

      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('Speech Synthesis not supported in this browser.')
    }
  }

  const stripMarkdown = (text) => {
    return text
      .replace(/<[^>]*>/g, '')                      // Remove HTML tags
      .replace(/(\*\*|__)(.*?)\1/g, '$2')           // Remove bold (** or __)
      .replace(/(\*|_)(.*?)\1/g, '$2')               // Remove italics (* or _)
      .replace(/~~(.*?)~~/g, '$1')                   // Remove strikethrough (~~)
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')           // Remove inline code (` or ```)
      .replace(/!\[.*?\]\(.*?\)/g, '')               // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')      // Remove links but keep the text
      .replace(/#+\s*(.*)/g, '$1')                   // Remove headings
      .replace(/>\s*(.*)/g, '$1')                    // Remove blockquotes
      .replace(/^\s*\n/gm, '')                       // Remove empty lines
  }

  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    // If waiting for the voice response and the last message is from the assistant and is complete, speak it
    if (waitingForVoiceResponse && lastMessage.role === 'assistant' && lastMessage.is_complete) {
      const santizedText = stripMarkdown(lastMessage.content)
      speak(santizedText)
      setWaitingForVoiceResponse(false)
    }
  }, [messages])

  // Manage the listening stop reason
  useEffect(() => {
    if (!listening) {
      if (isManuallyStopped) {
        // Speech recognition was stopped manually
        setIsManuallyStopped(false) // Reset manual stop flag
        // Do not set waiting state
      } else if (voiceActivated) {
        // Speech recognition stopped automatically
        setWaitingForVoiceResponse(true) // Set waiting state
      } else {
        // Speech recognition stopped automatically
        setVoiceActivated(false)
      }
    } else {
      // If listening is true, reset waiting state
      setWaitingForVoiceResponse(false)
    }
  }, [listening, isManuallyStopped])

  useEffect(() => {
    const url = 'ws://localhost:8001/ws/streaming-chat/'
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
  }, [])

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'user-message' : 'ai-message'}>
            <strong>{message.name}:</strong> {message.content}
          </div>
        ))}
        {waitingForVoiceResponse && (
          <div className="waiting-indicator">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <button
          className={`button-voice ${listening ? 'listening' : ''}`}
          onClick={listening ? stopListening : startListening}
        >
          {listening ? '🎤 Stop' : '🎙️ Voice'}
        </button>
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
