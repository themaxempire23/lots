const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(path, opts = {}) {
  const method = opts.method || 'GET'
  const body = opts.body
  const extraHeaders = opts.headers || {}
  const url = API_BASE + path

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const contentType = res.headers.get('content-type') || ''
  const isJSON = contentType.includes('application/json')
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    const msg = (isJSON && data && (data.error || data.message)) || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return data
}

export const api = {
  me:       () => request('/api/auth/me'),
  login:    (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  signup:   (payload) => request('/api/auth/signup', { method: 'POST', body: payload }),
  logout:   () => request('/api/auth/logout', { method: 'POST' }),

  createTask: (payload) => request('/api/tasks', { method: 'POST', body: payload }),
  listTasks:  ({ page = 1, limit = 10, q = '' } = {}) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q) qs.set('q', q)
    return request('/api/tasks?' + qs.toString())
  },
  getTask:    (id) => request('/api/tasks/' + id),
  updateTask: (id, payload) => request('/api/tasks/' + id, { method: 'PATCH', body: payload }),
  deleteTask: (id) => request('/api/tasks/' + id, { method: 'DELETE' })
}
