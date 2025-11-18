import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CategoryAdd from './pages/CategoryAdd'
import ProductAdd from './pages/ProductAdd'
import ProductList from './pages/ProductList'
import UserManagement from './pages/UserManagement'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function DashboardLayout() {
  const location = useLocation()
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/urun-listesi" replace />} />
        <Route path="/kategori-ekle" element={<CategoryAdd />} />
        <Route path="/urun-ekle" element={<ProductAdd />} />
        <Route path="/urun-listesi" element={<ProductList />} />
        <Route path="/kullanici-yonetimi" element={<UserManagement />} />
        <Route path="/istatistikler" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/urun-listesi" replace />} />
    </Routes>
  )
}

export default App
