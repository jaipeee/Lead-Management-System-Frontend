import { useNavigate } from 'react-router-dom'

function AppLayout({ children, user, onLogout }) {
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex min-h-screen">
      <nav className="fixed left-0 top-0 h-full w-48 bg-slate-900 text-white p-4 border-r border-slate-800 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold">LMS</h1>
          <p className="text-xs text-slate-400">Lead Management</p>
        </div>

        <ul className="space-y-2 mb-8">
          <li>
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition"
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/leads')}
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition"
            >
              📋 All Leads
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/meta-leads')}
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition"
            >
              📱 Meta Leads
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition"
            >
              📈 Analytics
            </button>
          </li>
        </ul>

        <hr className="border-slate-700 mb-4" />

        <div className="mt-auto">
          <div className="px-4 py-3 bg-slate-800 rounded mb-3">
            <p className="text-sm font-semibold truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || '-'}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 ml-48">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
