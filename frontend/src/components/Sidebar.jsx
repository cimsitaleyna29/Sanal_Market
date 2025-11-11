import { NavLink } from 'react-router-dom'

const links = [
  { to: '/kategori-ekle', label: 'Kategori Ekle', icon: '📁' },
  { to: '/urun-ekle', label: 'Ürün Ekle', icon: '🛒' },
  { to: '/urun-listesi', label: 'Ürün Listesi', icon: '📋' },
  { to: '/siparis-yonetimi', label: 'Sipariş Yönetimi', icon: '📦' },
  { to: '/odeme-fatura-yonetimi', label: 'Ödeme / Fatura Yönetimi', icon: '💳' },
  { to: '/kullanici-yonetimi', label: 'Kullanıcı Yönetimi', icon: '👤' },
  { to: '/kupon-kampanya-yonetimi', label: 'Kupon / Kampanya Yönetimi', icon: '🎟️' },
  { to: '/istatistikler', label: 'İstatistikler (Dashboard)', icon: '📊' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">SM</span>
        <div>
          <p className="sidebar__eyebrow">Sanal Market</p>
          <p className="sidebar__title">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
