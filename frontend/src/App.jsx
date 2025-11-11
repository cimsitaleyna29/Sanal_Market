import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CategoryAdd from './pages/CategoryAdd'
import ProductAdd from './pages/ProductAdd'
import ProductList from './pages/ProductList'
import PlaceholderPage from './pages/PlaceholderPage'

const placeholderRoutes = [
  { path: '/siparis-yonetimi', title: 'Sipariş Yönetimi' },
  { path: '/odeme-fatura-yonetimi', title: 'Ödeme / Fatura Yönetimi' },
  { path: '/teslimat-kargo-yonetimi', title: 'Teslimat / Kargo Yönetimi' },
  { path: '/kullanici-yonetimi', title: 'Kullanıcı Yönetimi' },
  { path: '/kupon-kampanya-yonetimi', title: 'Kupon / Kampanya Yönetimi' },
  { path: '/istatistikler', title: 'İstatistikler (Dashboard)' },
  { path: '/magaza-ayarlari', title: 'Mağaza Ayarları' },
  { path: '/musteri-mesajlari', title: 'Müşteri Mesajları / Geri Bildirimler' },
]

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/urun-listesi" replace />} />
            <Route path="/kategori-ekle" element={<CategoryAdd />} />
            <Route path="/urun-ekle" element={<ProductAdd />} />
            <Route path="/urun-listesi" element={<ProductList />} />
            {placeholderRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PlaceholderPage title={route.title} />}
              />
            ))}
            <Route path="*" element={<Navigate to="/urun-listesi" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
