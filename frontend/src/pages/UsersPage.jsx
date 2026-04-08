import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../api'
import { useAuth } from '../context/AuthContext'
import { Plus, Pencil, Trash2, X, ShieldCheck, Briefcase, User } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'ADMIN', label: 'Quản trị viên', icon: ShieldCheck, color: '#EF4444', bg: '#FEF2F2' },
  { value: 'MANAGER', label: 'Quản lý', icon: Briefcase, color: '#2563EB', bg: '#EFF6FF' },
  { value: 'STAFF', label: 'Nhân viên', icon: User, color: '#10B981', bg: '#ECFDF5' },
]

const EMPTY_FORM = { username: '', password: '', role: 'STAFF' }

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setModal('create') }
  const openEdit = (u) => {
    setForm({ username: u.username, password: '', role: u.role })
    setEditTarget(u); setModal('edit')
  }
  const closeModal = () => { setModal(null); setEditTarget(null) }

  const handleSave = async () => {
    if (!form.username.trim()) return toast.error('Tên đăng nhập không được trống')
    if (modal === 'create' && !form.password) return toast.error('Mật khẩu không được trống')
    setSaving(true)
    try {
      if (modal === 'create') {
        await createUser(form)
        toast.success('Tạo người dùng thành công')
      } else {
        const payload = { username: form.username, role: form.role }
        if (form.password) payload.password = form.password
        await updateUser(editTarget.id, payload)
        toast.success('Cập nhật thành công')
      }
      closeModal(); load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u) => {
    if (u.id === currentUser?.id) return toast.error('Không thể xóa tài khoản của chính mình')
    if (!confirm(`Xóa người dùng "${u.username}"?`)) return
    try {
      await deleteUser(u.id)
      toast.success('Đã xóa người dùng')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Không thể xóa')
    }
  }

  const roleInfo = (role) => ROLES.find(r => r.value === role)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Người dùng</h1>
          <p className="page-subtitle">{users.length} tài khoản</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16}/> Tạo người dùng
        </button>
      </div>

      <div className="user-role-stats">
        {ROLES.map(role => {
          const count = users.filter(u => u.role === role.value).length
          const Icon = role.icon
          return (
            <div key={role.value} className="stat-card">
              <div className="stat-icon" style={{ background: role.bg }}>
                <Icon size={20} style={{ color: role.color }}/>
              </div>
              <div className="stat-info">
                <span className="stat-value">{count}</span>
                <span className="stat-label">{role.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        {loading ? <div className="loading-spinner"/> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const role = roleInfo(u.role)
                  const Icon = role?.icon || User
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-row">
                          <div className="user-avatar-sm" style={{ background: role?.bg, color: role?.color }}>
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold">{u.username}</div>
                            {u.id === currentUser?.id && <div className="text-muted text-sm">(Bạn)</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: role?.bg, color: role?.color }}>
                          <Icon size={12}/> {role?.label}
                        </span>
                      </td>
                      <td>{format(new Date(u.created_at), 'dd/MM/yyyy')}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon btn-icon-edit" onClick={() => openEdit(u)}><Pencil size={14}/></button>
                          {u.id !== currentUser?.id && (
                            <button className="btn-icon btn-icon-delete" onClick={() => handleDelete(u)}><Trash2 size={14}/></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'Tạo người dùng mới' : 'Cập nhật người dùng'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={18}/></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên đăng nhập <span className="required">*</span></label>
                <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Nhập tên đăng nhập"/>
              </div>
              <div className="form-group">
                <label>Mật khẩu {modal === 'edit' && <span className="text-muted">(để trống = không đổi)</span>}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={modal === 'create' ? 'Nhập mật khẩu' : 'Mật khẩu mới'}/>
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <div className="role-selector">
                  {ROLES.map(role => {
                    const Icon = role.icon
                    return (
                      <div
                        key={role.value}
                        className={`role-option ${form.role === role.value ? 'selected' : ''}`}
                        style={form.role === role.value ? { borderColor: role.color, background: role.bg } : {}}
                        onClick={() => setForm({ ...form, role: role.value })}
                      >
                        <Icon size={18} style={{ color: role.color }}/>
                        <span>{role.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : (modal === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
