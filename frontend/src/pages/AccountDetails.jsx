import { useState, useEffect } from 'react'

const API_BASE = '/bank-api'

function AccountDetails() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div>
        <h1>Account Details</h1>
        <div className="card">
          <div className="empty">Loading accounts...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Account Details</h1>
      
      {error && <div className="message error">{error}</div>}

      <div className="card">
        <h2>All Accounts</h2>
        {accounts.length === 0 ? (
          <div className="empty">No accounts found. Create an account from the Swagger UI.</div>
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
