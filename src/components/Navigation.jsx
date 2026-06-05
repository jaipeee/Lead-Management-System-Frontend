import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed left-0 top-0 h-full w-48 bg-slate-900 text-white p-4 border-r border-slate-800">
      <div className="mb-8">
        <h1 className="text-xl font-bold">LMS</h1>
        <p className="text-xs text-slate-400">Lead Management System</p>
      </div>

      <ul className="space-y-2">
        <li>
          <Link
            to="/"
            className={`block px-4 py-2 rounded transition ${
              isActive('/') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/leads"
            className={`block px-4 py-2 rounded transition ${
              isActive('/leads') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            📋 All Leads
          </Link>
        </li>
        <li>
          <Link
            to="/meta-leads"
            className={`block px-4 py-2 rounded transition ${
              isActive('/meta-leads') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            📱 Meta Leads
          </Link>
        </li>
        <li>
          <Link
            to="/analytics"
            className={`block px-4 py-2 rounded transition ${
              isActive('/analytics') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            📈 Analytics
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
