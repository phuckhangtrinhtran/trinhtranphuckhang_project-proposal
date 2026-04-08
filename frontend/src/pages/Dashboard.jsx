import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, getAlerts, getTransactions } from '../api'
import { Package, AlertTriangle, TrendingDown, ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, lowStock: 0, expiring: 0, expired: 0 })
  const [recentTx, setRecentTx] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProducts(), getAlerts(), getTransactions()])
      .then(([products, alerts, txs]) => {
        setStats({
          total: products.data.length,
          lowStock: alerts.data.low_stock.length,
          expiring: alerts.data.expiring_soon.length,
          expired: alerts.data.expired.length,
        })
        setRecentTx(txs.data.slice(0, 8))
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Tổng sản phẩm', value: stats.total, icon: Package, color: '#2563EB', bg: '#EFF6FF', path: '/products' },
    { label: 'Sắp hết hàng', value: stats.lowStock, icon: TrendingDown, color: '#F59E0B', bg: '#FFFBEB', path: '/alerts' },
    { label: 'Sắp hết hạn', value: stats.expiring, icon: Clock, color: '#8B5CF6', bg: '#F5F3FF', path: '/alerts' },
    { label: 'Đã hết hạn', value: stats.expired, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', path: '/alerts' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tổng quan</h1>
          <p className="page-subtitle">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          <div className="stats-grid">
            {cards.map(({ label, value, icon: Icon, color, bg, path }) => (
              <div
                key={label}
                className="stat-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(path)}
              >
                <div className="stat-icon" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{value}</span>
                  <span className="stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Giao dịch gần đây</h2>
              <button className="btn btn-ghost" onClick={() => navigate('/transactions')}>
                Xem tất cả →
              </button>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Loại</th>
                    <th>Số lượng</th>
                    <th>Thời gian</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.length === 0 ? (
                    <tr><td colSpan={5} className="empty-row">Chưa có giao dịch nào</td></tr>
                  ) : recentTx.map(tx => (
                    <tr key={tx.id}>
                      <td><strong>{tx.product_name}</strong></td>
                      <td>
                        <span className={`badge ${tx.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>
                          {tx.type === 'IN'
                            ? <><ArrowDownCircle size={12} /> Nhập</>
                            : <><ArrowUpCircle size={12} /> Xuất</>}
                        </span>
                      </td>
                      <td>{tx.quantity.toLocaleString()}</td>
                      <td>{format(new Date(tx.transaction_date), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="text-muted">{tx.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
