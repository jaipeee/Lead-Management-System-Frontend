import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://lead-management-system-backend-r12h.onrender.com/'

function LoginPage({ flashMessage, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [flash, setFlash] = useState(flashMessage)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setFlash('')
    setIsLoggingIn(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        setFlash(data.msg || 'Login failed')
        return
      }

      if (!data.token) {
        setFlash('Login worked, but token was not returned. Restart backend server.')
        return
      }

      onLoginSuccess(data.token, data.user)
    } catch {
      setFlash('Server is not responding')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <section className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Lead Management</p>
          <h1 className="mt-2 text-3xl font-semibold">Login</h1>
        </div>

        <form onSubmit={handleLogin} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {flash && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {flash}
            </div>
          )}

          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            required
          />

          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="mb-5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
