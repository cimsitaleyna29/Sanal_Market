import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/kategori-ekle': 'Kategori Yönetimi',
  '/urun-ekle': 'Ürün Yönetimi',
  '/urun-listesi': 'Ürün Listesi',
  '/kullanici-yonetimi': 'Kullanıcı Yönetimi',
  '/istatistikler': 'Genel İstatistikler',
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] ?? 'Yönetim Paneli'

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <div>
        <p className="header__eyebrow">Sanal Market</p>
        <h1 className="header__title">{title}</h1>
      </div>
      <div className="header__actions">
        <button type="button" className="button header__logout" onClick={handleLogout}>
          Çıkış
        </button>
      </div>
    </header>
  )
}

export default Header
