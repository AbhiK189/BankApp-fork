import { useState } from 'react'

const API_BASE = '/bank-api'

function TransactionHistory() {
  const [accountNumber, setAccountNumber] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!accountNumber) return

    setLoading(true)
    setError(null)
    setTransactions([])
    setSearched(true)

    try {
      const response = await fetch(`${API_BASE}/accounts/transactions/${accountNumber}`)
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to fetch transactions')
      }
      const data = await response.json()
      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Transaction History</h1>
      
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

      {searched && !error && (
        <div className="card">
          <h2>Transactions for Account #{accountNumber}</h2>
          
          {transactions.length === 0 ? (
            <div className="empty">No transactions found for this account.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.txDateTime}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: tx.txType === 'CREDIT' ? '#e8f5e9' : '#ffebee',
                        color: tx.txType === 'CREDIT' ? '#2e7d32' : '#c62828',
                        fontWeight: '500'
                      }}>
                        {tx.txType}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: 'bold',
                      color: tx.txType === 'CREDIT' ? '#2e7d32' : '#c62828'
                    }}>
                      {tx.txType === 'CREDIT' ? '+' : '-'}${tx.txAmount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!searched && (
        <div className="card">
          <div className="empty">
            Enter an account number above to view transaction history.
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
