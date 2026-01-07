import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = '/bank-api'

function CreateCustomer() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    customerNumber: '',
    status: 'ACTIVE',
    customerAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    },
    contactDetails: {
      emailId: '',
      homePhone: '',
      workPhone: ''
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        customerAddress: { ...prev.customerAddress, [field]: value }
      }))
    } else if (name.startsWith('contact.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = {
        ...formData,
        customerNumber: parseInt(formData.customerNumber)
      }
      
      const response = await fetch(`${API_BASE}/customers/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to create customer')
      }
      
      setSuccess('Customer created successfully!')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Create Customer</h1>
      
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Number *</label>
              <input
                type="number"
                name="customerNumber"
                value={formData.customerNumber}
                onChange={handleChange}
                required
                placeholder="e.g., 1001"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Address</h2>
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              name="address.address1"
              value={formData.customerAddress.address1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="address.address2"
              value={formData.customerAddress.address2}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={formData.customerAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={formData.customerAddress.state}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zip"
                value={formData.customerAddress.zip}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.customerAddress.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <h2>Contact Information</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="contact.emailId"
              value={formData.contactDetails.emailId}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Home Phone</label>
              <input
                type="tel"
                name="contact.homePhone"
                value={formData.contactDetails.homePhone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Work Phone</label>
              <input
                type="tel"
                name="contact.workPhone"
                value={formData.contactDetails.workPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCustomer
