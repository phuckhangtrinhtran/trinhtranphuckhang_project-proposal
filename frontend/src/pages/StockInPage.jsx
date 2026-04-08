import { useState, useEffect } from 'react'
import { getProducts, createTransaction } from '../api'
import { ArrowDownCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StockInPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ quantity: '', note: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProducts({ search }).then(r => setProducts(r.data))
  }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) return toast.error('Chọn sản phẩm trước')
    if (!form.quantity || parseInt(form.quantity) <= 0) return toast.error('Số lượng phải > 0')
    setSaving(true)
    try {
      await createTransaction({
        product_id: selected.id,
        type: 'IN',
        quantity: parseInt(form.quantity),
        note: form.note
      })
      toast.success(`Nhập kho thành công: +${form.quantity} ${selected.name}`)
      setSelected(null)
      setForm({ quantity: '', note: '' })
      getProducts().then(r => setProducts(r.data))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhập kho</h1>
          <p className="page-subtitle">Thêm hàng hóa vào kho</p>
        </div>
      </div>

      <div className="two-col-layout">
        {/* Left: Product list */}
        <div className="card">
          <div className="card-header">
            <h2>Chọn sản phẩm</h2>
          </div>
          <div className="search-input mb-16">
            <Search size={16}/>
            <input placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="product-select-list">
            {products.map(p => (
              <div
                key={p.id}
                className={`product-select-item ${selected?.id === p.id ? 'selected' : ''}`}
                onClick={() => setSelected(p)}
              >
                <div className="product-select-name">{p.name}</div>
                <div className="product-select-meta">
                  {p.category && <span className="badge badge-neutral">{p.category}</span>}
                  <span className="text-muted">Tồn: <strong>{p.quantity}</strong></span>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-muted text-center py-16">Không tìm thấy sản phẩm</p>}
          </div>
        </div>

        {/* Right: Form */}
        <div className="card">
          <div className="card-header">
            <h2>Thông tin nhập kho</h2>
          </div>
          {selected ? (
            <form onSubmit={handleSubmit}>
              <div className="selected-product-preview">
                <ArrowDownCircle size={24} color="#10B981" />
                <div>
                  <div className="font-bold">{selected.name}</div>
                  <div className="text-muted text-sm">Tồn kho hiện tại: <strong>{selected.quantity}</strong></div>
                </div>
              </div>
              <div className="form-group">
                <label>Số lượng nhập <span className="required">*</span></label>
                <input
                  type="number" min="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder="Nhập số lượng"
                  required
                />
                {form.quantity > 0 && selected && (
                  <div className="form-hint text-success">
                    → Tồn kho sau nhập: {selected.quantity + parseInt(form.quantity || 0)}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="Ghi chú (không bắt buộc)"
                  rows={3}
                />
              </div>
              <button type="submit" className="btn btn-success btn-block" disabled={saving}>
                <ArrowDownCircle size={16} />
                {saving ? 'Đang lưu...' : 'Xác nhận nhập kho'}
              </button>
            </form>
          ) : (
            <div className="empty-state">
              <ArrowDownCircle size={48} color="#D1D5DB" />
              <p>Chọn sản phẩm bên trái để nhập kho</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
