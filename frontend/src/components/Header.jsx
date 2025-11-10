import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/kategori-ekle': 'Kategori Ekle',
  '/urun-ekle': 'Ürün Ekle',
  '/urun-listesi': 'Ürün Listesi',
}

function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Yönetim Paneli'

  return (
    <header className="header">
      <div>
        <p className="header__eyebrow">Sanal Market</p>
        <h1 className="header__title">{title}</h1>
      </div>
    </header>
  )
}

export default Header
