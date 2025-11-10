import './App.css'

const categories = [
  {
    name: 'Meyve & Sebze',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Et & Tavuk',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Süt Ürünleri',
    image:
      'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Atıştırmalık',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'İçecekler',
    image:
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Temizlik',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kahvaltı',
    image:
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bebek Ürünleri',
    image:
      'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&w=600&q=80',
  },
]

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <h1 className="navbar__title">🛒 Sanal Market</h1>
        <nav className="navbar__links">
          <a href="#">Ana Sayfa</a>
          <a href="#">Ürün Ekle</a>
          <a href="#">Kategori Ekle</a>
        </nav>
      </header>

      <main className="category-section">
        <div className="section-heading">
          <p>Favori kategorilerini keşfet, siparişin kapına gelsin.</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.name} className="category-card">
              <div className="category-card__image">
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>
              <h3>{category.name}</h3>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Sanal Market. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

export default App
