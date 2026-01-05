import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Courses from './components/Courses'

export default function App() {
  const token = localStorage.getItem('token')
  const [showRegister, setShowRegister] = useState(false)
  if (token) return <Courses />
  return showRegister
    ? <Register onBack={() => setShowRegister(false)} />
    : <Login onRegister={() => setShowRegister(true)} />
}
