import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function formatDate(date) {
  if (!date) {
    return '-'
  }
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function MetaLeadsPage({ token, onLoginExpired }) {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)
  const [webhookStatus, setWebhookStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    async function fetchMetaLeads() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${API_URL}/api/meta/leads?page=${page}&limit=${limit}`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            onLoginExpired('Session expired. Please login again.')
            return
          }
          setError(data.msg || 'Failed to fetch leads')
          return
        }

        setLeads(data.leads || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError('Error connecting to server: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetaLeads()
  }, [token, page, limit, onLoginExpired])

  // Fetch webhook status
  useEffect(() => {
    async function fetchStatus() {
      setStatusLoading(true)

      try {
        const response = await fetch(`${API_URL}/api/meta/status`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (response.ok) {
          setWebhookStatus(data)
        }
      } catch (err) {
        console.error('Error fetching webhook status:', err)
      } finally {
        setStatusLoading(false)
      }
    }

    fetchStatus()
  }, [token])

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page * limit < total) setPage(page + 1)
  }

  const handleViewDetails = (lead) => {
    setSelectedLead(lead)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedLead(null)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="meta-leads-page" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>📱 Meta Leads Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Real-time leads from Facebook & Instagram ads
      </p>

      {/* Webhook Status Card */}
      <div
        style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}
      >
        {statusLoading ? (
          <p>Loading webhook status...</p>
        ) : webhookStatus ? (
          <div>
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>🔗 Webhook Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <small style={{ color: '#6b7280' }}>Status</small>
                <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>
                  ✓ {webhookStatus.status}
                </p>
              </div>
              <div>
                <small style={{ color: '#6b7280' }}>Webhook URL</small>
                <p style={{ margin: '5px 0', fontSize: '12px', wordBreak: 'break-all', color: '#1f2937' }}>
                  {webhookStatus.webhook_url}
                </p>
              </div>
              <div>
                <small style={{ color: '#6b7280' }}>API Version</small>
                <p style={{ margin: '5px 0', color: '#1f2937' }}>{webhookStatus.api_version}</p>
              </div>
              <div>
                <small style={{ color: '#6b7280' }}>Events Subscribed</small>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#1f2937' }}>
                  {webhookStatus.events_subscribed?.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#991b1b'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>
            {total}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#0369a1' }}>Total Leads</p>
        </div>
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
            {page * limit > total ? total : page * limit}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#15803d' }}>Showing</p>
        </div>
        <div
          style={{
            backgroundColor: '#f3e8ff',
            border: '1px solid #e9d5ff',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#6d28d9' }}>
            {totalPages}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6d28d9' }}>Pages</p>
        </div>
      </div>

      {/* Leads Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}
        >
          <p style={{ margin: 0, fontSize: '16px' }}>No Meta leads yet</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
            Leads will appear here when users submit forms from your Meta ads
          </p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Name
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Phone
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Service
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Campaign
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#374151', fontWeight: '600' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9fafb')
                    }
                  >
                    <td style={{ padding: '12px', color: '#111827' }}>{lead.name}</td>
                    <td style={{ padding: '12px', color: '#111827', fontSize: '12px' }}>
                      {lead.email}
                    </td>
                    <td style={{ padding: '12px', color: '#111827' }}>{lead.phone}</td>
                    <td style={{ padding: '12px', color: '#111827' }}>{lead.service}</td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '12px' }}>
                      {lead.campaign || '-'}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '12px' }}>
                      {formatDate(lead.createdAt)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(lead)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px'
            }}
          >
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: page === 1 ? '#e5e7eb' : '#3b82f6',
                color: page === 1 ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              ← Previous
            </button>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: page >= totalPages ? '#e5e7eb' : '#3b82f6',
                color: page >= totalPages ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Lead Details Modal */}
      {showDetails && selectedLead && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseDetails}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: '#1f2937' }}>Lead Details</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Name
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>{selectedLead.name}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Email
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>{selectedLead.email}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Phone
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>{selectedLead.phone}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Service
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>{selectedLead.service}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Campaign
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>
                {selectedLead.campaign || '-'}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Status
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>{selectedLead.status}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Source
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#059669' }}>
                📱 {selectedLead.source.toUpperCase()}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                Date Received
              </label>
              <p style={{ margin: '5px 0 0 0', color: '#111827' }}>
                {formatDate(selectedLead.createdAt)}
              </p>
            </div>

            {selectedLead.notes && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>
                  Additional Notes
                </label>
                <p
                  style={{
                    margin: '5px 0 0 0',
                    color: '#111827',
                    whiteSpace: 'pre-wrap',
                    fontSize: '12px'
                  }}
                >
                  {selectedLead.notes}
                </p>
              </div>
            )}

            <button
              onClick={handleCloseDetails}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MetaLeadsPage
