import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulated login - accept any non-empty credentials
    if (username.trim() && password.trim()) {
      onLogin(username)
      setError('')
    } else {
      setError('Please enter both username and password')
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
        
        <p className="login-hint">Demo: Enter any username and password to login</p>
      </div>
    </div>
  )
}

export default Login

