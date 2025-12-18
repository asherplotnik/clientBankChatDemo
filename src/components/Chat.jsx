import { useState, useRef, useEffect } from 'react'
import ChatApiService from '../services/chatApiService'
import './Chat.css'

function Chat({ username, onLogout }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const chatApiService = new ChatApiService()

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
      // Call simulated chat API service
      const data = await chatApiService.sendMessage(inputMessage, username)
      
      // Handle response - API returns { message: "text" }
      const botMessageText = data.message || 'No response from server'
      
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
        text: `Error: ${error.message}. Please try again.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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
            <p className="welcome-hint">Using simulated API responses</p>
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
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={isLoading}
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

