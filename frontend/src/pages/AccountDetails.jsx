import { useState } from 'react'

const API_BASE = '/bank-api'

function AccountDetails() {
  const [accountNumber, setAccountNumber] = useState('')
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!accountNumber) return

    setLoading(true)
    setError(null)
    setAccount(null)

    try {
      const response = await fetch(`${API_BASE}/accounts/${accountNumber}`)
      const text = await response.text()
      
      // Try to parse as JSON first
      try {
        const data = JSON.parse(text)
        if (data.accountNumber) {
          setAccount(data)
          return
        }
      } catch (parseErr) {
        // Not valid JSON, treat as error message
      }
      
      // If we get here, it's an error
      throw new Error(text || 'Account not found')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Account Details</h1>
      
      <div className="card">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="number"
            placeholder="Enter Account Number (e.g., 5001)"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="message error">{error}</div>}

      {account && (
        <div className="card">
          <h2>Account Information</h2>
          <table>
            <tbody>
              <tr>
                <th style={{ width: '200px' }}>Account Number</th>
                <td>{account.accountNumber}</td>
              </tr>
              <tr>
                <th>Account Type</th>
                <td>{account.accountType}</td>
              </tr>
              <tr>
                <th>Account Status</th>
                <td>{account.accountStatus}</td>
              </tr>
              <tr>
                <th>Balance</th>
                <td style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  ${account.accountBalance?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <th>Created Date</th>
                <td>{account.accountCreated || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          {account.bankInformation && (
            <>
              <h2 style={{ marginTop: '30px' }}>Bank Information</h2>
              <table>
                <tbody>
                  <tr>
                    <th style={{ width: '200px' }}>Branch Name</th>
                    <td>{account.bankInformation.branchName}</td>
                  </tr>
                  <tr>
                    <th>Branch Code</th>
                    <td>{account.bankInformation.branchCode}</td>
                  </tr>
                  <tr>
                    <th>Routing Number</th>
                    <td>{account.bankInformation.routingNumber}</td>
                  </tr>
                  {account.bankInformation.branchAddress && (
                    <tr>
                      <th>Branch Address</th>
                      <td>
                        {account.bankInformation.branchAddress.address1}
                        {account.bankInformation.branchAddress.address2 && `, ${account.bankInformation.branchAddress.address2}`}
                        <br />
                        {account.bankInformation.branchAddress.city}, {account.bankInformation.branchAddress.state} {account.bankInformation.branchAddress.zip}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {!account && !error && !loading && (
        <div className="card">
          <div className="empty">
            Enter an account number above to view account details.
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetails
