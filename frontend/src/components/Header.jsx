import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/kategori-ekle': 'Kategori Ekle',
  '/urun-ekle': 'Ürün Ekle',
  '/urun-listesi': 'Ürün Listesi',
  '/siparis-yonetimi': 'Sipariş Yönetimi',
  '/odeme-fatura-yonetimi': 'Ödeme / Fatura Yönetimi',
  '/teslimat-kargo-yonetimi': 'Teslimat / Kargo Yönetimi',
  '/kullanici-yonetimi': 'Kullanıcı Yönetimi',
  '/kupon-kampanya-yonetimi': 'Kupon / Kampanya Yönetimi',
  '/istatistikler': 'İstatistikler (Dashboard)',
  '/magaza-ayarlari': 'Mağaza Ayarları',
  '/musteri-mesajlari': 'Müşteri Mesajları / Geri Bildirimler',
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
