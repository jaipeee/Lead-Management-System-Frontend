import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function DashboardPage({ token, user, onLoginExpired }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/api/reports/analytics`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()

        if (!response.ok) {
          onLoginExpired(data.msg || 'Please login again')
          return
        }

        setStats(data.stats)

        const leadsResponse = await fetch(`${API_URL}/api/lead?limit=5`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const leadsData = await leadsResponse.json()
        setRecentLeads(leadsData.leads || [])
      } catch (error) {
        console.log('Error fetching dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [token, onLoginExpired])

  const getSourceColor = (source) => {
    switch (source) {
      case 'website':
        return 'bg-blue-100 text-blue-800'
      case 'meta':
        return 'bg-purple-100 text-purple-800'
      case 'google':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'converted':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {stats && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-8">
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/leads')}>
                    <p className="text-sm text-slate-600">Total Leads</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalLeads}</p>
                    <p className="mt-2 text-xs text-slate-500">{stats.todayLeads} new today</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/leads')}>
                    <p className="text-sm text-slate-600">Conversion Rate</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">{stats.conversionRate}%</p>
                    <p className="mt-2 text-xs text-slate-500">{stats.byStatus.converted || 0} converted</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-600">New Leads</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{stats.byStatus.new || 0}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-600">Contacted</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.byStatus.contacted || 0}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-600">Lost</p>
                    <p className="mt-2 text-3xl font-bold text-red-600">{stats.byStatus.lost || 0}</p>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Source Distribution</h2>
                    <div className="space-y-4">
                      {Object.entries(stats.bySource || {}).map(([source, count]) => (
                        <div key={source}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium capitalize">{source}</span>
                            <span className="text-sm font-semibold text-slate-600">{count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-slate-600 h-2 rounded-full transition-all"
                              style={{
                                width: stats.totalLeads > 0 ? `${(count / stats.totalLeads * 100)}%` : '0%'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Lead Status</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'New', value: stats.byStatus.new || 0, color: 'bg-blue-600' },
                        { label: 'Contacted', value: stats.byStatus.contacted || 0, color: 'bg-yellow-600' },
                        { label: 'Converted', value: stats.byStatus.converted || 0, color: 'bg-green-600' },
                        { label: 'Lost', value: stats.byStatus.lost || 0, color: 'bg-red-600' }
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-sm font-semibold text-slate-600">{item.value}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`${item.color} h-2 rounded-full transition-all`}
                              style={{
                                width: stats.totalLeads > 0 ? `${(item.value / stats.totalLeads * 100)}%` : '0%'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold">Recent Leads</h2>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>

              {recentLeads.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No leads yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Name</th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Email</th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Source</th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-slate-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead._id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-3 font-medium">{lead.name || '-'}</td>
                          <td className="px-6 py-3 text-slate-600">{lead.email || '-'}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getSourceColor(lead.source)}`}>
                              {lead.source || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusColor(lead.status)}`}>
                              {lead.status || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-600">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/leads')}
                className="flex-1 rounded-md bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700"
              >
                📋 View All Leads
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="flex-1 rounded-md bg-slate-600 text-white px-6 py-3 font-medium hover:bg-slate-700"
              >
                📊 Analytics & Reports
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
