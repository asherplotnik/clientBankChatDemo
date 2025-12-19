import { useState } from 'react'
import { users } from '../data/users'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate against users list
    const user = users.find(
      u => u.username === username.trim() && u.password === password.trim()
    )
    
    if (user) {
      onLogin(user.username, user.customer_id)
      setError('')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bank Chat</h1>
        <p className="login-subtitle">Sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        
        <p className="login-hint">Use: user1/123 or user2/123</p>
      </div>
    </div>
  )
}

export default Login

