import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components'
import {
  Admin,
  Cart,
  Category,
  Home,
  PurchaseCancel,
  PurchaseSuccess,
  SignUp,
  SignIn,
} from './pages'
import PrivateRoute from './routes/privateRoute'
import PublicRoute from './routes/publicRoute'

function App() {
  const user = { role: 'customer' }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <PrivateRoute>
                {user?.role === 'admin' ? <Admin /> : <Navigate to="/signin" />}
              </PrivateRoute>
            }
          />
          <Route path="category/:category" element={<Category />} />
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-success"
            element={
              <PrivateRoute>
                <PurchaseSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-cancel"
            element={
              <PrivateRoute>
                <PurchaseCancel />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
