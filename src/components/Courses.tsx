import { useEffect, useState, useRef } from 'react'
import { authFetch, API_URL } from './api'
import LessonManager from './LessonManager'

type Course = {
  id: string
  title: string
  status: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export default function Courses() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [courses, setCourses] = useState<Course[]>([])
  const [title, setTitle] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [showLessons, setShowLessons] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    let url = `/api/courses/search?page=${page}&pageSize=${pageSize}`
    if (status !== '') url += `&status=${Number(status)}`

    const res = await authFetch(url)
    const data = await res.json()

    setCourses(
      data.data.map((c: any) => ({
        ...c,
        status: Number(c.status)
      }))
    )
    setTotal(data.total)
  }

  async function create() {
    setError('')
    const res = await authFetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({ title })
    })
    if (!res.ok) {
      setError('Error al crear curso')
      return
    }
    setTitle('')
    load()
  }

  async function remove(id: string) {
    if (!window.confirm('¿Eliminar curso?')) return
    await authFetch(`/api/courses/${id}`, { method: 'DELETE' })
    load()
  }

  async function publish(id: string) {
    await authFetch(`/api/courses/${id}/publish`, { method: 'PATCH' })
    load()
  }

  async function unpublish(id: string) {
    await authFetch(`/api/courses/${id}/unpublish`, { method: 'PATCH' })
    load()
  }

  async function handleImportExcel(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    setError('')

    try {
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_URL}/api/courses/import`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })

      if (!res.ok) {
        setError('Error al importar el archivo')
        return
      }

      setError('Importación exitosa')
      load()
    } catch {
      setError('Error al importar el archivo')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    load()
  }, [page, status])

  if (showLessons) {
    return (
      <LessonManager
        courseId={showLessons}
        onBack={() => setShowLessons(null)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa' }}>
      <aside
        style={{
          width: 220,
          background: '#e3e8f0',
          color: '#222',
          padding: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '2px 0 8px #e3e8f0'
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: 24,
            marginBottom: 32,
            letterSpacing: 1
          }}
        >
          CoursesPlatform
        </h2>
        <nav style={{ width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
            <li
              style={{
                padding: '12px 32px',
                fontWeight: 500,
                cursor: 'pointer',
                background: '#dde3ea',
                borderRadius: 6,
                marginBottom: 8
              }}
            >
              Inicio
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px 48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>
            Cursos asignados
          </h2>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.reload()
            }}
            style={{
              background: '#e3e8f0',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título nuevo curso"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: '1px solid #cfd8dc',
              fontSize: 16
            }}
          />
          <button
            onClick={create}
            style={{
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: 16
            }}
          >
            Crear
          </button>

          <input
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImportExcel}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: '#43a047',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: 16
            }}
          >
            Importar Excel
          </button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ marginRight: 8, fontWeight: 500 }}>Estado:</label>
          <select
            value={status}
            onChange={e => {
              setStatus(e.target.value)
              setPage(1)
            }}
            style={{
              padding: 8,
              borderRadius: 6,
              border: '1px solid #cfd8dc',
              fontSize: 16
            }}
          >
            <option value="">Todos</option>
            <option value="0">Draft</option>
            <option value="1">Published</option>
          </select>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
          {courses.map(c => (
            <li
              key={c.id}
              style={{
                marginBottom: 12,
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 2px 8px #e3e8f0'
              }}
            >
              <span style={{ fontWeight: 'bold', flex: 1, fontSize: 18 }}>
                {c.title}
              </span>

              <span style={{ color: '#888', fontWeight: 500 }}>
                {c.status === 0 ? 'Draft' : 'Published'}
              </span>

              <button
                onClick={() => remove(c.id)}
                style={{
                  background: '#e3e8f0',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontWeight: 500
                }}
              >
                Eliminar
              </button>

              {c.status === 0 && (
                <button
                  onClick={() => publish(c.id)}
                  style={{
                    background: '#43a047',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 500
                  }}
                >
                  Publicar
                </button>
              )}

              {c.status === 1 && (
                <button
                  onClick={() => unpublish(c.id)}
                  style={{
                    background: '#fbc02d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 500
                  }}
                >
                  Despublicar
                </button>
              )}

              <button
                onClick={() => setShowLessons(c.id)}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontWeight: 500
                }}
              >
                Lecciones
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
