import { useState, useEffect } from 'react'
import { getProducts, createTransaction } from '../api'
import { ArrowUpCircle, Search, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StockOutPage() {
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
    const qty = parseInt(form.quantity)
    if (!qty || qty <= 0) return toast.error('Số lượng phải > 0')
    if (qty > selected.quantity) return toast.error(`Không đủ hàng! Tồn kho: ${selected.quantity}`)
    setSaving(true)
    try {
      await createTransaction({ product_id: selected.id, type: 'OUT', quantity: qty, note: form.note })
      toast.success(`Xuất kho thành công: -${qty} ${selected.name}`)
      const updatedProducts = await getProducts()
      setProducts(updatedProducts.data)
      const updated = updatedProducts.data.find(p => p.id === selected.id)
      setSelected(updated || null)
      setForm({ quantity: '', note: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const afterQty = selected ? selected.quantity - (parseInt(form.quantity) || 0) : 0
  const willLowStock = selected && afterQty <= selected.low_stock_threshold && afterQty >= 0

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Xuất kho</h1>
          <p className="page-subtitle">Xuất hàng hóa khỏi kho</p>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="card">
          <div className="card-header"><h2>Chọn sản phẩm</h2></div>
          <div className="search-input mb-16">
            <Search size={16}/>
            <input placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="product-select-list">
            {products.map(p => (
              <div
                key={p.id}
                className={`product-select-item ${selected?.id === p.id ? 'selected' : ''} ${p.quantity === 0 ? 'disabled' : ''}`}
                onClick={() => p.quantity > 0 && setSelected(p)}
              >
                <div className="product-select-name">{p.name}</div>
                <div className="product-select-meta">
                  {p.category && <span className="badge badge-neutral">{p.category}</span>}
                  <span className={p.quantity === 0 ? 'text-danger' : 'text-muted'}>
                    Tồn: <strong>{p.quantity}</strong>
                    {p.quantity === 0 && ' (Hết hàng)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Thông tin xuất kho</h2></div>
          {selected ? (
            <form onSubmit={handleSubmit}>
              <div className="selected-product-preview" style={{ borderColor: '#EF4444', background: '#FEF2F2' }}>
                <ArrowUpCircle size={24} color="#EF4444" />
                <div>
                  <div className="font-bold">{selected.name}</div>
                  <div className="text-muted text-sm">Tồn kho hiện tại: <strong>{selected.quantity}</strong></div>
                </div>
              </div>
              <div className="form-group">
                <label>Số lượng xuất <span className="required">*</span></label>
                <input
                  type="number" min="1" max={selected.quantity}
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder="Nhập số lượng"
                  required
                />
                {form.quantity > 0 && (
                  <div className={`form-hint ${afterQty < 0 ? 'text-danger' : afterQty <= selected.low_stock_threshold ? 'text-warning' : 'text-success'}`}>
                    → Tồn kho sau xuất: {afterQty}
                    {afterQty < 0 && ' ⚠️ Vượt quá số lượng tồn!'}
                    {afterQty >= 0 && willLowStock && ' ⚠️ Sẽ xuống dưới ngưỡng cảnh báo'}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="Lý do xuất hàng (không bắt buộc)"
                  rows={3}
                />
              </div>
              {willLowStock && afterQty >= 0 && (
                <div className="alert alert-warning">
                  <AlertTriangle size={16} />
                  <span>Tồn kho sẽ xuống dưới ngưỡng cảnh báo ({selected.low_stock_threshold}). Cần nhập thêm hàng sớm!</span>
                </div>
              )}
              <button type="submit" className="btn btn-danger btn-block" disabled={saving}>
                <ArrowUpCircle size={16} />
                {saving ? 'Đang lưu...' : 'Xác nhận xuất kho'}
              </button>
            </form>
          ) : (
            <div className="empty-state">
              <ArrowUpCircle size={48} color="#D1D5DB" />
              <p>Chọn sản phẩm bên trái để xuất kho</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
