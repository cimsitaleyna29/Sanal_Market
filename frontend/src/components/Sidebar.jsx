import { NavLink } from 'react-router-dom'

const links = [
  { to: '/kategori-ekle', label: '📁 Kategori Ekle' },
  { to: '/urun-ekle', label: '🛒 Ürün Ekle' },
  { to: '/urun-listesi', label: '📋 Ürün Listesi' },
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
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
