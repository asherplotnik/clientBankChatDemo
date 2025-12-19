import { useState } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [customerId, setCustomerId] = useState('')

  const handleLogin = (user, customer_id) => {
    setUsername(user)
    setCustomerId(customer_id)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setCustomerId('')
  }

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} customerId={customerId} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App

