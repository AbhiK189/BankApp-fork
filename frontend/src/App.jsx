import { Routes, Route, Link } from 'react-router-dom'
import CustomerList from './pages/CustomerList'
import CreateCustomer from './pages/CreateCustomer'
import AccountDetails from './pages/AccountDetails'

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Customers</Link></li>
          <li><Link to="/create-customer">Create Customer</Link></li>
          <li><Link to="/account">Accounts</Link></li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/create-customer" element={<CreateCustomer />} />
          <Route path="/account" element={<AccountDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
