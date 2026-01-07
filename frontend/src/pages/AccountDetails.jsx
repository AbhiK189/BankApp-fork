import { useState, useEffect } from 'react'

const API_BASE = '/bank-api'

function AccountDetails() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(null)
  const [formData, setFormData] = useState({
    customerNumber: '',
    accountNumber: '',
    accountType: 'SAVINGS',
    accountBalance: '',
    branchName: '',
    branchCode: '',
    routingNumber: '',
    branchAddress1: '',
    branchCity: '',
    branchState: '',
    branchZip: '',
    branchCountry: 'USA'
  })

  useEffect(() => {
    fetchAllAccounts()
  }, [])

  const fetchAllAccounts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/accounts/all`)
      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }
      const data = await response.json()
      setAccounts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAccount = (account) => {
    setSelectedAccount(selectedAccount?.accountNumber === account.accountNumber ? null : account)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    setError(null)
    setCreateSuccess(null)

    const accountData = {
      accountNumber: parseInt(formData.accountNumber),
      accountType: formData.accountType,
      accountStatus: 'ACTIVE',
      accountBalance: parseFloat(formData.accountBalance) || 0,
      bankInformation: {
        branchName: formData.branchName,
        branchCode: parseInt(formData.branchCode),
        routingNumber: parseInt(formData.routingNumber),
        branchAddress: {
          address1: formData.branchAddress1,
          city: formData.branchCity,
          state: formData.branchState,
          zip: formData.branchZip,
          country: formData.branchCountry
        }
      }
    }

    try {
      const response = await fetch(`${API_BASE}/accounts/add/${formData.customerNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      })

      const text = await response.text()
      if (response.ok || response.status === 201) {
        setCreateSuccess('Account created successfully!')
        setShowCreateForm(false)
        setFormData({
          customerNumber: '',
          accountNumber: '',
          accountType: 'SAVINGS',
          accountBalance: '',
          branchName: '',
          branchCode: '',
          routingNumber: '',
          branchAddress1: '',
          branchCity: '',
          branchState: '',
          branchZip: '',
          branchCountry: 'USA'
        })
        fetchAllAccounts()
      } else {
        throw new Error(text || 'Failed to create account')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Accounts</h1>
        <div className="card">
          <div className="empty">Loading accounts...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Accounts</h1>
      
      {error && <div className="message error">{error}</div>}
      {createSuccess && <div className="message success">{createSuccess}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>All Accounts</h2>
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create Account'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateAccount} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Create New Account</h3>
            
            <div className="form-row">
              <label>Customer Number *</label>
              <input type="number" name="customerNumber" value={formData.customerNumber} onChange={handleInputChange} required placeholder="e.g., 1001" />
            </div>
            
            <div className="form-row">
              <label>Account Number *</label>
              <input type="number" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} required placeholder="e.g., 5001" />
            </div>
            
            <div className="form-row">
              <label>Account Type *</label>
              <select name="accountType" value={formData.accountType} onChange={handleInputChange}>
                <option value="SAVINGS">SAVINGS</option>
                <option value="CHECKING">CHECKING</option>
              </select>
            </div>
            
            <div className="form-row">
              <label>Initial Balance</label>
              <input type="number" name="accountBalance" value={formData.accountBalance} onChange={handleInputChange} placeholder="0.00" step="0.01" />
            </div>
            
            <h4>Bank Information</h4>
            
            <div className="form-row">
              <label>Branch Name *</label>
              <input type="text" name="branchName" value={formData.branchName} onChange={handleInputChange} required placeholder="e.g., Main Branch" />
            </div>
            
            <div className="form-row">
              <label>Branch Code *</label>
              <input type="number" name="branchCode" value={formData.branchCode} onChange={handleInputChange} required placeholder="e.g., 101" />
            </div>
            
            <div className="form-row">
              <label>Routing Number *</label>
              <input type="number" name="routingNumber" value={formData.routingNumber} onChange={handleInputChange} required placeholder="e.g., 123456789" />
            </div>
            
            <div className="form-row">
              <label>Branch Address *</label>
              <input type="text" name="branchAddress1" value={formData.branchAddress1} onChange={handleInputChange} required placeholder="e.g., 100 Bank St" />
            </div>
            
            <div className="form-row">
              <label>City *</label>
              <input type="text" name="branchCity" value={formData.branchCity} onChange={handleInputChange} required placeholder="e.g., New York" />
            </div>
            
            <div className="form-row">
              <label>State *</label>
              <input type="text" name="branchState" value={formData.branchState} onChange={handleInputChange} required placeholder="e.g., NY" />
            </div>
            
            <div className="form-row">
              <label>ZIP *</label>
              <input type="text" name="branchZip" value={formData.branchZip} onChange={handleInputChange} required placeholder="e.g., 10001" />
            </div>
            
            <button type="submit" style={{ marginTop: '15px' }}>Create Account</button>
          </form>
        )}

        {accounts.length === 0 ? (
          <div className="empty">No accounts found. Click "Create Account" to add one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.accountNumber}>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountType}</td>
                  <td>{account.accountStatus}</td>
                  <td style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    ${account.accountBalance?.toFixed(2) || '0.00'}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleSelectAccount(account)}
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      {selectedAccount?.accountNumber === account.accountNumber ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAccount && (
        <div className="card">
          <h2>Account Information - #{selectedAccount.accountNumber}</h2>
          <table>
            <tbody>
              <tr>
                <th style={{ width: '200px' }}>Account Number</th>
                <td>{selectedAccount.accountNumber}</td>
              </tr>
              <tr>
                <th>Account Type</th>
                <td>{selectedAccount.accountType}</td>
              </tr>
              <tr>
                <th>Account Status</th>
                <td>{selectedAccount.accountStatus}</td>
              </tr>
              <tr>
                <th>Balance</th>
                <td style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  ${selectedAccount.accountBalance?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <th>Created Date</th>
                <td>{selectedAccount.accountCreated || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          {selectedAccount.bankInformation && (
            <>
              <h2 style={{ marginTop: '30px' }}>Bank Information</h2>
              <table>
                <tbody>
                  <tr>
                    <th style={{ width: '200px' }}>Branch Name</th>
                    <td>{selectedAccount.bankInformation.branchName}</td>
                  </tr>
                  <tr>
                    <th>Branch Code</th>
                    <td>{selectedAccount.bankInformation.branchCode}</td>
                  </tr>
                  <tr>
                    <th>Routing Number</th>
                    <td>{selectedAccount.bankInformation.routingNumber}</td>
                  </tr>
                  {selectedAccount.bankInformation.branchAddress && (
                    <tr>
                      <th>Branch Address</th>
                      <td>
                        {selectedAccount.bankInformation.branchAddress.address1}
                        {selectedAccount.bankInformation.branchAddress.address2 && `, ${selectedAccount.bankInformation.branchAddress.address2}`}
                        <br />
                        {selectedAccount.bankInformation.branchAddress.city}, {selectedAccount.bankInformation.branchAddress.state} {selectedAccount.bankInformation.branchAddress.zip}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountDetails
