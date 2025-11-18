import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const emptyForm = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  password: '',
}

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formValues, setFormValues] = useState(() => ({ ...emptyForm }))
  const [roleValue, setRoleValue] = useState('user')
  const [salaryValue, setSalaryValue] = useState('')

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((user) => user.is_active).length
    const admins = users.filter((user) => user.role === 'admin').length
    return { total, active, admins }
  }, [users])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getUsers()
      setUsers(response)
    } catch (err) {
      setError(err.message || 'Kullanıcılar alınırken bir sorun oluştu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openModal = (type, user = null) => {
    setModal(type)
    setSelectedUser(user)
    setError('')

    if (type === 'create') {
      setFormValues({ ...emptyForm })
    }

    if (type === 'edit' && user) {
      setFormValues({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone || '',
        password: '',
      })
    }

    if (user) {
      setRoleValue(user.role)
      setSalaryValue(user.details?.salary != null ? String(user.details.salary) : '')
    } else {
      setRoleValue('user')
      setSalaryValue('')
    }
  }

  const closeModal = () => {
    setModal(null)
    setSelectedUser(null)
    setFormValues({ ...emptyForm })
    setRoleValue('user')
    setSalaryValue('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = {
        ...formValues,
        name: formValues.name.trim(),
        surname: formValues.surname.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim() || null,
      }
      if (!payload.password) {
        delete payload.password
      } else {
        payload.password = payload.password.trim()
      }

      if (modal === 'create') {
        await api.createUser(payload)
      } else if (modal === 'edit' && selectedUser) {
        await api.updateUser(selectedUser.id, payload)
      }

      await fetchUsers()
      closeModal()
    } catch (err) {
      setError(err.message || 'İşlem sırasında bir hata oluştu.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedUser) return
    setSubmitting(true)
    setError('')

    try {
      await api.updateUserRole(selectedUser.id, roleValue)
      await fetchUsers()
      closeModal()
    } catch (err) {
      setError(err.message || 'Rol güncellenemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSalarySubmit = async (event) => {
    event.preventDefault()
    if (!selectedUser) return
    setSubmitting(true)
    setError('')

    try {
      const salaryNumber = Number(salaryValue)
      if (Number.isNaN(salaryNumber)) {
        throw new Error('Lütfen geçerli bir maaş tutarı girin.')
      }
      await api.setUserSalary(selectedUser.id, { salary: salaryNumber })
      await fetchUsers()
      closeModal()
    } catch (err) {
      setError(err.message || 'Maaş bilgisi güncellenemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`${user.name} ${user.surname} kullanıcısını silmek istediğinize emin misiniz?`)
    if (!confirmed) return

    setError('')
    try {
      await api.deleteUser(user.id)
      await fetchUsers()
    } catch (err) {
      setError(err.message || 'Kullanıcı silinemedi.')
    }
  }

  return (
    <div className="user-management">
      <div className="panel panel--soft">
        <div>
          <p className="panel__eyebrow">KULLANICI YÖNETİMİ</p>
          <h2 className="panel__title">Kullanıcı Listesi</h2>
          <p className="panel__subtitle">
            Toplam {stats.total} kayıtlı kullanıcı • Aktif {stats.active} • Admin {stats.admins}
          </p>
        </div>
        <div className="user-management__actions">
          <button type="button" className="button button--outline" onClick={fetchUsers}>
            Yenile
          </button>
          <button type="button" className="button button--gradient" onClick={() => openModal('create')}>
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <div className="panel panel--table">
        {loading ? (
          <p className="panel__placeholder">Veriler yükleniyor...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Rol</th>
                  <th>Maaş</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`chip chip--${user.role === 'admin' ? 'warning' : 'info'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td>{user.details?.salary ? currencyFormatter.format(user.details.salary) : '-'}</td>
                    <td>
                      <span className={`status status--${user.is_active ? 'success' : 'muted'}`}>
                        {user.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td>
                      <div className="table__actions">
                        <button type="button" className="button button--pill" onClick={() => openModal('edit', user)}>
                          Düzenle
                        </button>
                        <button type="button" className="button button--pill" onClick={() => openModal('role', user)}>
                          Rol Güncelle
                        </button>
                        <button type="button" className="button button--pill" onClick={() => openModal('salary', user)}>
                          Maaş
                        </button>
                        <button type="button" className="button button--danger" onClick={() => handleDelete(user)}>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="table__empty">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'create' || modal === 'edit' ? (
        <Modal title={modal === 'create' ? 'Yeni Kullanıcı' : 'Kullanıcıyı Düzenle'} onClose={closeModal}>
          <form className="user-form" onSubmit={handleUserSubmit}>
            <div className="user-form__grid">
              <label>
                <span>Ad</span>
                <input name="name" value={formValues.name} onChange={handleChange} required />
              </label>
              <label>
                <span>Soyad</span>
                <input name="surname" value={formValues.surname} onChange={handleChange} required />
              </label>
              <label>
                <span>E-posta</span>
                <input type="email" name="email" value={formValues.email} onChange={handleChange} required />
              </label>
              <label>
                <span>Telefon</span>
                <input name="phone" value={formValues.phone} onChange={handleChange} placeholder="05xx xxx xx xx" />
              </label>
              <label>
                <span>Şifre {modal === 'edit' ? '(opsiyonel)' : ''}</span>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder={modal === 'edit' ? 'Değiştirmek istemiyorsanız boş bırakın' : 'En az 6 karakter'}
                  required={modal === 'create'}
                />
              </label>
            </div>
            <div className="user-form__actions">
              <button type="button" className="button button--ghost" onClick={closeModal}>
                Vazgeç
              </button>
              <button type="submit" className="button button--primary" disabled={submitting}>
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {modal === 'role' && selectedUser ? (
        <Modal title={`${selectedUser.name} ${selectedUser.surname} • Rol`} onClose={closeModal}>
          <form className="user-form" onSubmit={handleRoleSubmit}>
            <label>
              <span>Rol Seçimi</span>
              <select value={roleValue} onChange={(event) => setRoleValue(event.target.value)}>
                <option value="admin">Admin</option>
                <option value="user">Kullanıcı</option>
              </select>
            </label>
            <div className="user-form__actions">
              <button type="button" className="button button--ghost" onClick={closeModal}>
                Vazgeç
              </button>
              <button type="submit" className="button button--primary" disabled={submitting}>
                {submitting ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {modal === 'salary' && selectedUser ? (
        <Modal title={`${selectedUser.name} ${selectedUser.surname} • Maaş`} onClose={closeModal}>
          <form className="user-form" onSubmit={handleSalarySubmit}>
            <label>
              <span>Maaş Tutarı (TL)</span>
              <input
                type="number"
                min="0"
                step="500"
                value={salaryValue}
                onChange={(event) => setSalaryValue(event.target.value)}
                placeholder="Örn: 25000"
                required
              />
            </label>
            <div className="user-form__actions">
              <button type="button" className="button button--ghost" onClick={closeModal}>
                Vazgeç
              </button>
              <button type="submit" className="button button--primary" disabled={submitting}>
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content">
        <div className="modal__header">
          <h3>{title}</h3>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Pencereyi kapat">
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default UserManagement
