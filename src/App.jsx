import { useState } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (user) => {
    setUsername(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App

