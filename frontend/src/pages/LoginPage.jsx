import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin, getMe } from '../api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiLogin(form)
      const token = res.data.access_token
      const meRes = await getMe()
      login(token, meRes.data)
      toast.success(`Xin chào, ${meRes.data.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#2563EB"/>
            <path d="M10 14h20M10 20h20M10 26h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30" cy="26" r="5" fill="#F59E0B"/>
            <path d="M28 26l1.5 1.5L32 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>InvenTrack</span>
        </div>
        <h1>Đăng nhập hệ thống</h1>
        <p className="login-subtitle">Quản lý kho hàng thông minh</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="login-hint">
          <p><strong>Demo:</strong> admin / admin123</p>
          <p>manager / manager123 &nbsp;|&nbsp; staff / staff123</p>
        </div>
      </div>
    </div>
  )
}
