import { useState, useRef, useEffect } from 'react'
import './Chat.css'

function Chat({ username, customerId, onLogout }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const CHAT_API_URL = 'http://localhost:8081/api/v1/chat'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call chat API endpoint
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Customer-ID': customerId
        },
        body: JSON.stringify({
          messageText: inputMessage
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle response - adjust based on actual API response format
      const botMessageText = data.message || data.messageText || data.text || data.answer ||'No response from server'
      
      const botMessage = {
        id: Date.now() + 1,
        text: botMessageText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please check if the API endpoint is running.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Refocus the input field after response
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>Bank Chat</h2>
          <p>Welcome, {username}</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Start a conversation by sending a message below.</p>
            <p className="welcome-hint">API Endpoint: {CHAT_API_URL}</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          className="send-button"
          disabled={!inputMessage.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat

