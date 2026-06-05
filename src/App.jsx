import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import DashboardPage from './components/DashboardPage.jsx'
import LeadViewPage from './components/LeadViewPage.jsx'
import AnalyticsPage from './components/AnalyticsPage.jsx'
import MetaLeadsPage from './components/MetaLeadsPage.jsx'
import LoginPage from './components/LoginPage.jsx'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loginMessage, setLoginMessage] = useState('')

  const isLoggedIn = Boolean(token)

  function handleLoginSuccess(newToken, loggedUser) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(loggedUser))
    setToken(newToken)
    setUser(loggedUser)
    setLoginMessage('')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
  }

  function handleLoginExpired(message) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    setLoginMessage(message)
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        flashMessage={loginMessage}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                token={token}
                user={user}
                onLoginExpired={handleLoginExpired}
              />
            }
          />
          <Route
            path="/leads"
            element={
              <LeadViewPage
                token={token}
                user={user}
                onLoginExpired={handleLoginExpired}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <AnalyticsPage
                token={token}
                user={user}
                onLoginExpired={handleLoginExpired}
              />
            }
          />
          <Route
            path="/meta-leads"
            element={
              <MetaLeadsPage
                token={token}
                onLoginExpired={handleLoginExpired}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
