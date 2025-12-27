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

      // Parse response - even for 403 status, we want to show the answer
      const data = await response.json()
      
      // Handle new structured response format (DraftResponseDTO)
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        // Handle both new structured format and legacy format
        introduction: data.introduction || data.message || data.messageText || data.text || data.answer || 'No response from server',
        table: data.table || null,
        dataSource: data.dataSource || null
      }

      setMessages(prev => [...prev, botMessage])

      // If response is not ok and not 403, throw error
      if (!response.ok && response.status !== 403) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
            className={`message ${message.sender} ${message.isError ? 'error' : ''} ${message.table ? 'has-table' : ''}`}
          >
            <div className="message-content">
              {/* Handle both new structured format and legacy format */}
              {(message.introduction || message.text) && (
                <p>{message.introduction || message.text}</p>
              )}
              
              {/* Render table if present */}
              {message.table && message.table.headers && message.table.rows && (
                <div className="response-table-container">
                  <table className="response-table">
                    <thead>
                      <tr>
                        {message.table.headers.map((header, idx) => (
                          <th key={idx}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {message.table.headers.map((header, colIdx) => (
                            <td key={colIdx}>
                              {row[header] !== null && row[header] !== undefined 
                                ? String(row[header])
                                : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* Render totals row if present */}
                      {message.table.metadata?.hasTotals && message.table.metadata?.totals && (
                        <tr className="totals-row">
                          {message.table.headers.map((header, colIdx) => (
                            <td key={colIdx}>
                              {message.table.metadata.totals[header] !== null && 
                               message.table.metadata.totals[header] !== undefined
                                ? String(message.table.metadata.totals[header])
                                : ''}
                            </td>
                          ))}
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {message.table.metadata?.rowCount && (
                    <div className="table-metadata">
                      Total rows: {message.table.metadata.rowCount}
                    </div>
                  )}
                </div>
              )}
              
              {/* Render data source information if present */}
              {message.dataSource && (
                <div className="data-source-info">
                  {message.dataSource.description && (
                    <p className="data-source-description">{message.dataSource.description}</p>
                  )}
                  {(message.dataSource.api || message.dataSource.timeRange) && (
                    <div className="data-source-details">
                      {message.dataSource.api && (
                        <span className="data-source-tag">API: {message.dataSource.api}</span>
                      )}
                      {message.dataSource.timeRange && (
                        <span className="data-source-tag">Period: {message.dataSource.timeRange}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
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

