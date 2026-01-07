import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = '/bank-api'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/customers/all`)
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleDelete = async (customerNumber) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    
    try {
      const response = await fetch(`${API_BASE}/customers/${customerNumber}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete customer')
      fetchCustomers()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="loading">Loading customers...</div>

  return (
    <div>
      <h1>Customers</h1>
      
      {error && <div className="message error">{error}</div>}
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Customer List</h2>
          <Link to="/create-customer">
            <button>Add New Customer</button>
          </Link>
        </div>
        
        {customers.length === 0 ? (
          <div className="empty">No customers found. Create one to get started!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer #</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerNumber}>
                  <td>{customer.customerNumber}</td>
                  <td>{customer.firstName} {customer.middleName} {customer.lastName}</td>
                  <td>{customer.contactDetails?.emailId || '-'}</td>
                  <td>{customer.contactDetails?.homePhone || '-'}</td>
                  <td>{customer.customerAddress?.city || '-'}</td>
                  <td>{customer.status}</td>
                  <td className="actions">
                    <button 
                      className="danger" 
                      onClick={() => handleDelete(customer.customerNumber)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default CustomerList
