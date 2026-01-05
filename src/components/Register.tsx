import { useState } from 'react'
import { API_URL } from './api'

export default function Register({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function register() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        setError('No se pudo registrar. Intenta con otro email.')
        setLoading(false)
        return
      }
      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.')
      setEmail('')
      setPassword('')
    } catch (e) {
      setError('Error de red o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: 400, padding: 40, borderRadius: 20, background: 'linear-gradient(135deg, #f8f8ff 60%, #e6e6fa 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#222' }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Registro</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', marginBottom: 16, padding: 14, borderRadius: 10, border: 'none', background: '#ececff', color: '#222', fontSize: 18, outline: 'none', boxShadow: '0 2px 8px #e3e8f0' }} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', marginBottom: 16, padding: 14, borderRadius: 10, border: 'none', background: '#ececff', color: '#222', fontSize: 18, outline: 'none', boxShadow: '0 2px 8px #e3e8f0' }} />
      <button onClick={register} disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(90deg,#b39ddb 0%, #9575cd 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 20, letterSpacing: 1, boxShadow: '0 4px 16px #ececff', marginTop: 8 }}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      <button onClick={onBack} style={{ width: '100%', padding: 14, background: '#ececff', color: '#222', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 20, letterSpacing: 1, marginTop: 16 }}>Volver</button>
      {error && <div style={{ color: '#e53935', marginTop: 16, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: '#43a047', marginTop: 16, fontWeight: 500 }}>{success}</div>}
    </div>
  )
}
