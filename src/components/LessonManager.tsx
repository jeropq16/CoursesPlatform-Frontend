
export default function LessonManager({ courseId, onBack }: { courseId: string, onBack: () => void }) {
  const [lessons, setLessons] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    setError('')
    try {
      const res = await authFetch(`/api/courses/${courseId}/lessons`)
      if (!res.ok) {
        setError('No se pudieron cargar las lecciones')
        setLessons([])
        return
      }
      const data = await res.json()
      setLessons(data || [])
    } catch (e) {
      setError('No se pudieron cargar las lecciones')
      setLessons([])
    }
  }

  async function create() {
    setError('')
    setSuccess('')
    const res = await authFetch(`/api/lessons`, {
      method: 'POST',
      body: JSON.stringify({ title, courseId })
    })
    if (!res.ok) {
      setError('Error al crear lección')
      setSuccess('')
      return
    }
    setTitle('')
    setSuccess('Lección creada correctamente')
    load()
    setTimeout(() => setSuccess(''), 2000)
  }

  async function remove(id: string) {
    if (!window.confirm('¿Eliminar lección?')) return
    await authFetch(`/api/lessons/${id}`, { method: 'DELETE' })
    load()
  }

  async function move(id: string, dir: 'up' | 'down') {
    await authFetch(`/api/lessons/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ direction: dir })
    })
    load()
  }

  useEffect(() => { load() }, [courseId])

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
      <button onClick={onBack} style={{ marginBottom: 16, background: '#eee', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}>Volver a cursos</button>
      <h3 style={{ marginTop: 0 }}>Lecciones</h3>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título nueva lección" style={{ flex: 1, padding: 8 }} />
        <button onClick={create} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Crear</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}/>
      {lessons.length === 0 ? (
        <div style={{ color: '#888', marginTop: 16, textAlign: 'center' }}>No hay lecciones en este curso.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lessons.map((l: any, i: number) => (
            <li key={l.id} style={{ marginBottom: 8, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6, padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1 }}>{l.order}. {l.title}</span>
              <button onClick={() => remove(l.id)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Eliminar</button>
              <button disabled={i === 0} onClick={() => move(l.id, 'up')} style={{ background: i === 0 ? '#eee' : '#1976d2', color: i === 0 ? '#888' : 'white', border: 'none', borderRadius: 4, padding: '6px 12px' }}>↑</button>
              <button disabled={i === lessons.length - 1} onClick={() => move(l.id, 'down')} style={{ background: i === lessons.length - 1 ? '#eee' : '#1976d2', color: i === lessons.length - 1 ? '#888' : 'white', border: 'none', borderRadius: 4, padding: '6px 12px' }}>↓</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { authFetch } from './api';
