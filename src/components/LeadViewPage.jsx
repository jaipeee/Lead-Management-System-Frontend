import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3000'

function formatDate(date) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function LeadViewPage({ token, user, onLoginExpired }) {
  const [leads, setLeads] = useState([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [filterSource, setFilterSource] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function fetchLeads() {
      setIsLoadingLeads(true)

      try {
        let url = `${API_URL}/api/lead?page=${page}&limit=${limit}`
        
        const response = await fetch(url, {
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

        let filteredLeads = data.leads || []
        
        if (filterSource) {
          filteredLeads = filteredLeads.filter(l => l.source === filterSource)
        }
        if (filterStatus) {
          filteredLeads = filteredLeads.filter(l => l.status === filterStatus)
        }

        filteredLeads.sort((a, b) => {
          let aVal = a[sortBy]
          let bVal = b[sortBy]
          
          if (sortBy === 'createdAt') {
            aVal = new Date(aVal)
            bVal = new Date(bVal)
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })

        setLeads(filteredLeads)
        setTotal(data.total || 0)
      } catch {
        setLeads([])
      } finally {
        setIsLoadingLeads(false)
      }
    }

    fetchLeads()
  }, [token, page, limit, onLoginExpired, filterSource, filterStatus, sortBy, sortOrder])

  async function exportToExcel() {
    setIsExporting(true)
    try {
      const response = await fetch(`${API_URL}/api/reports/export/excel`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads_${new Date().getTime()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.log('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  async function exportToPDF() {
    setIsExporting(true)
    try {
      const response = await fetch(`${API_URL}/api/reports/export/pdf`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads_report_${new Date().getTime()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.log('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold">All Leads</h1>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by Source</label>
              <select
                value={filterSource}
                onChange={(e) => {
                  setFilterSource(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="">All Sources</option>
                <option value="website">Website</option>
                <option value="meta">Meta</option>
                <option value="google">Google</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="createdAt">Date</option>
                <option value="name">Name</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className="rounded bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              📊 Export Excel
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="rounded bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 disabled:bg-gray-400"
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{leads.length}</span> of <span className="font-semibold">{total}</span> leads
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {page} of {Math.ceil(total / limit) || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingLeads && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan="8">
                      Loading leads...
                    </td>
                  </tr>
                )}

                {!isLoadingLeads && leads.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan="8">
                      No leads found
                    </td>
                  </tr>
                )}

                {!isLoadingLeads && leads.map((lead) => (
                  <tr className="border-t border-slate-100 hover:bg-slate-50" key={lead._id}>
                    <td className="px-4 py-3 font-medium">{lead.name || '-'}</td>
                    <td className="px-4 py-3">{lead.email || '-'}</td>
                    <td className="px-4 py-3">{lead.phone || '-'}</td>
                    <td className="px-4 py-3">{lead.service || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                        lead.source === 'website' ? 'bg-blue-100 text-blue-800' :
                        lead.source === 'meta' ? 'bg-purple-100 text-purple-800' :
                        lead.source === 'google' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.source || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{lead.campaign || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                        lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LeadViewPage
