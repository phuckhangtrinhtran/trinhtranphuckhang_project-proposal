import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import StockInPage from './pages/StockInPage'
import StockOutPage from './pages/StockOutPage'
import TransactionsPage from './pages/TransactionsPage'
import AlertsPage from './pages/AlertsPage'
import UsersPage from './pages/UsersPage'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="full-loading"><div className="loading-spinner"/></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace/> : <LoginPage/>} />
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage/></ProtectedRoute>} />
      <Route path="/stock-in" element={<ProtectedRoute><StockInPage/></ProtectedRoute>} />
      <Route path="/stock-out" element={<ProtectedRoute><StockOutPage/></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute roles={['ADMIN','MANAGER']}><TransactionsPage/></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage/></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UsersPage/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </BrowserRouter>
  )
}
