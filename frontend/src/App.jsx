import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CategoryAdd from './pages/CategoryAdd'
import ProductAdd from './pages/ProductAdd'
import ProductList from './pages/ProductList'

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
            <Route path="*" element={<Navigate to="/urun-listesi" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
