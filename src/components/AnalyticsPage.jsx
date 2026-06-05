import { useEffect, useState } from 'react'

const API_URL = 'https://lead-management-system-backend-r12h.onrender.com/'

function AnalyticsPage({ token, user, onLoginExpired }) {
  const [stats, setStats] = useState(null)
  const [sourcePerf, setSourcePerf] = useState([])
  const [campaignPerf, setCampaignPerf] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchAnalytics() {
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
        setSourcePerf(data.sourcePerformance || [])
        setCampaignPerf(data.campaignPerformance || [])
      } catch (error) {
        console.log('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [token, onLoginExpired])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-7xl text-center py-20">
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold">Analytics & Reports</h1>
        </div>

        {stats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Total Leads</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalLeads}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Today's Leads</p>
              <p className="mt-2 text-3xl font-bold">{stats.todayLeads}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="mt-2 text-3xl font-bold">{stats.conversionRate}%</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Converted Leads</p>
              <p className="mt-2 text-3xl font-bold">{stats.byStatus.converted || 0}</p>
            </div>
          </div>
        )}

        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Lead Status Breakdown</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">New</span>
                    <span className="text-sm font-semibold">{stats.byStatus.new || 0}</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: stats.totalLeads > 0 ? `${((stats.byStatus.new || 0) / stats.totalLeads * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Contacted</span>
                    <span className="text-sm font-semibold">{stats.byStatus.contacted || 0}</span>
                  </div>
                  <div className="w-full bg-yellow-100 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: stats.totalLeads > 0 ? `${((stats.byStatus.contacted || 0) / stats.totalLeads * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Converted</span>
                    <span className="text-sm font-semibold">{stats.byStatus.converted || 0}</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: stats.totalLeads > 0 ? `${((stats.byStatus.converted || 0) / stats.totalLeads * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Lost</span>
                    <span className="text-sm font-semibold">{stats.byStatus.lost || 0}</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: stats.totalLeads > 0 ? `${((stats.byStatus.lost || 0) / stats.totalLeads * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Source Breakdown</h2>
              <div className="space-y-3">
                {Object.entries(stats.bySource || {}).map(([source, count]) => (
                  <div key={source}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 capitalize">{source}</span>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-slate-600 h-2 rounded-full"
                        style={{
                          width: stats.totalLeads > 0 ? `${(count / stats.totalLeads * 100)}%` : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sourcePerf.length > 0 && (
          <div className="mb-8 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Source Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Source</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Total Leads</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Converted</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcePerf.map((perf, idx) => (
                    <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium capitalize">{perf.source}</td>
                      <td className="px-6 py-3">{perf.total}</td>
                      <td className="px-6 py-3">{perf.converted}</td>
                      <td className="px-6 py-3">
                        <span className="inline-block rounded bg-blue-100 px-3 py-1 text-blue-800 font-semibold">
                          {perf.conversionRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {campaignPerf.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Top Campaigns</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Campaign</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Total Leads</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Converted</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerf.slice(0, 10).map((perf, idx) => (
                    <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium">{perf.campaign || 'Direct'}</td>
                      <td className="px-6 py-3">{perf.total}</td>
                      <td className="px-6 py-3">{perf.converted}</td>
                      <td className="px-6 py-3">
                        <span className="inline-block rounded bg-green-100 px-3 py-1 text-green-800 font-semibold">
                          {perf.conversionRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default AnalyticsPage
