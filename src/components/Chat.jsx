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

  // Helper function to render a single table
  const renderTable = (table, tableIndex) => {
    if (!table || !table.headers || !table.rows) return null

    return (
      <div key={tableIndex} className="response-table-container">
        {/* Display account name if present */}
        {table.accountName && (
          <div className="table-account-name">
            {table.accountName}
          </div>
        )}
        <table className="response-table">
          <thead>
            <tr>
              {table.headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => {
              // Handle both array and object row formats
              const isArrayRow = Array.isArray(row)
              
              // If row is an object, get values as array to access by index
              // This handles the case where headers are in Hebrew but row keys are in English
              let rowValues = isArrayRow ? row : (row && typeof row === 'object' ? Object.values(row) : [])
              
              // Reverse only the values (not headers) to match the header order
              rowValues = [...rowValues].reverse()
              
              return (
                <tr key={rowIdx}>
                  {table.headers.map((header, colIdx) => {
                    // Access value by index - values are reversed but headers are not
                    let cellValue = rowValues[colIdx]
                    
                    // Fallback: if value is null/undefined and row is object, try key-based access
                    if ((cellValue === null || cellValue === undefined) && !isArrayRow && row && typeof row === 'object') {
                      // Try exact key match with header
                      cellValue = row[header]
                      
                      // Try case-insensitive key match
                      if (cellValue === null || cellValue === undefined) {
                        const rowKeys = Object.keys(row)
                        const matchingKey = rowKeys.find(key => 
                          key.toLowerCase() === header.toLowerCase()
                        )
                        if (matchingKey) {
                          cellValue = row[matchingKey]
                        }
                      }
                    }
                    
                    return (
                      <td key={colIdx}>
                        {cellValue !== null && cellValue !== undefined 
                          ? String(cellValue)
                          : ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {/* Render totals row if present */}
            {table.metadata?.hasTotals && table.metadata?.totals && (
              <tr className="totals-row">
                {table.headers.map((header, colIdx) => {
                  // Reverse totals values to match reversed row values
                  const totalsValues = Object.values(table.metadata.totals)
                  const reversedTotals = [...totalsValues].reverse()
                  const totalsValue = reversedTotals[colIdx]
                  
                  return (
                    <td key={colIdx}>
                      {totalsValue !== null && totalsValue !== undefined
                        ? String(totalsValue)
                        : ''}
                    </td>
                  )
                })}
              </tr>
            )}
          </tbody>
        </table>
        {table.metadata?.rowCount && (
          <div className="table-metadata">
            Total rows: {table.metadata.rowCount}
          </div>
        )}
      </div>
    )
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
      
      // Handle new ChatResponse format
      // Tables are now in data.tables (List<DraftResponseDTO.TableData>)
      const tables = data.tables && Array.isArray(data.tables) ? data.tables : []
      
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        // ChatResponse uses 'answer' field, fallback to legacy formats for backward compatibility
        answer: data.answer || data.introduction || data.message || data.messageText || data.text || 'No response from server',
        explanation: data.explanation || null,
        correlationId: data.correlationId || null,
        tables: tables,
        // dataSource is no longer at root level in ChatResponse
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
            className={`message ${message.sender} ${message.isError ? 'error' : ''} ${(message.tables && message.tables.length > 0) ? 'has-table' : ''}`}
          >
            <div className="message-content">
              {/* Display answer/introduction text */}
              {(message.answer || message.introduction || message.text) && (
                <p>{message.answer || message.introduction || message.text}</p>
              )}
              
              {/* Render tables if present */}
              {message.tables && message.tables.length > 0 && (
                <div className="tables-container">
                  {message.tables.map((table, tableIndex) => renderTable(table, tableIndex))}
                </div>
              )}
              
              {/* Render explanation if present (ChatResponse.explanation) */}
              {message.explanation && (
                <div className="explanation-info">
                  <p className="explanation-label">How I got this:</p>
                  <p className="explanation-text">{message.explanation}</p>
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

