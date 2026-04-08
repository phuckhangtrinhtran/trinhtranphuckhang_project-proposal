import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, ArrowDownCircle, ArrowUpCircle,
  History, Users, LogOut, Bell, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard, roles: ['ADMIN','MANAGER','STAFF'] },
  { to: '/products', label: 'Sản phẩm', icon: Package, roles: ['ADMIN','MANAGER','STAFF'] },
  { to: '/stock-in', label: 'Nhập kho', icon: ArrowDownCircle, roles: ['ADMIN','MANAGER','STAFF'] },
  { to: '/stock-out', label: 'Xuất kho', icon: ArrowUpCircle, roles: ['ADMIN','MANAGER','STAFF'] },
  { to: '/transactions', label: 'Lịch sử', icon: History, roles: ['ADMIN','MANAGER'] },
  { to: '/alerts', label: 'Cảnh báo', icon: Bell, roles: ['ADMIN','MANAGER','STAFF'] },
  { to: '/users', label: 'Người dùng', icon: Users, roles: ['ADMIN'] },
]

const ROLE_LABELS = { ADMIN: 'Quản trị viên', MANAGER: 'Quản lý', STAFF: 'Nhân viên' }
const ROLE_COLORS = { ADMIN: '#EF4444', MANAGER: '#2563EB', STAFF: '#10B981' }

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role))

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="9" fill="#2563EB"/>
            <path d="M9 13h18M9 18h18M9 23h11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="27" cy="23" r="4.5" fill="#F59E0B"/>
            <path d="M25.5 23l1.2 1.2L28.8 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>InvenTrack</span>
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }>
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role" style={{ color: ROLE_COLORS[user?.role] }}>
                {ROLE_LABELS[user?.role]}
              </span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Đăng xuất">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
