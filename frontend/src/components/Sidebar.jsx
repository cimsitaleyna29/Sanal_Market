import { NavLink } from 'react-router-dom'
import logoImage from '../assets/sanal-market-logo.svg'

const links = [
  { to: '/kategori-ekle', label: 'Kategori Yönetimi', icon: '📁' },
  { to: '/urun-ekle', label: 'Ürün Yönetimi', icon: '🛒' },
  { to: '/urun-listesi', label: 'Ürün Listesi', icon: '📋' },
  { to: '/kullanici-yonetimi', label: 'Kullanıcı Yönetimi', icon: '👤' },
  { to: '/istatistikler', label: 'İstatistikler (Dashboard)', icon: '📊' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img className="sidebar__logo" src={logoImage} alt="Sanal Market" />
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
