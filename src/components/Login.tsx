import { useState } from 'react'
import { API_URL, authFetch } from './api'

export default function Login({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login?email=${email}&password=${password}`, { method: 'POST' })
      if (!res.ok) {
        setError('Credenciales incorrectas')
        setLoading(false)
        return
      }
      const data = await res.json()
      if (!data.token) {
        setError('Respuesta inválida del servidor')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      window.location.reload()
    } catch (e) {
      setError('Error de red o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400, padding: 40, borderRadius: 20, background: 'linear-gradient(135deg, #f8f8ff 60%, #e6e6fa 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#222' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#43436b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
        </div>
        <div style={{ color: '#222', marginBottom: 32, fontSize: 18, textAlign: 'center' }}>Welcome to the website</div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', marginBottom: 16, padding: 14, borderRadius: 10, border: 'none', background: '#ececff', color: '#222', fontSize: 18, outline: 'none', boxShadow: '0 2px 8px #e3e8f0' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', marginBottom: 16, padding: 14, borderRadius: 10, border: 'none', background: '#ececff', color: '#222', fontSize: 18, outline: 'none', boxShadow: '0 2px 8px #e3e8f0' }} />
        <button onClick={login} disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg,#4f5bd5 0%, #5f6ee6 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 20, letterSpacing: 1, boxShadow: '0 4px 16px #ececff', marginTop: 8 }}>
          {loading ? 'Ingresando...' : 'Login'}
        </button>
        <button onClick={onRegister} style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg,#b39ddb 0%, #9575cd 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 20, letterSpacing: 1, boxShadow: '0 4px 16px #ececff', marginTop: 16 }}>Register</button>
        {error && <div style={{ color: '#e53935', marginTop: 16, fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  )
}
