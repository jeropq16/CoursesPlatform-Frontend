
// Para Vite, las variables de entorno deben empezar con VITE_
// Asegúrate de tener un archivo .env con VITE_API_URL=http://localhost:5107
const viteEnv = (import.meta as any).env || (window as any).env || {}
export const API_URL = viteEnv.VITE_API_URL || 'https://coursesplatform-backend.onrender.com'

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(API_URL + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...(options.headers || {})
    }
  })
  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.reload()
    throw new Error('No autorizado')
  }
  return res
}

