import { useEffect, useState } from 'react'
import { api } from '../api/client'

const STAT_CARDS = [
  {
    key: 'users',
    label: 'Toplam Kullanıcı',
    description: 'Sistemde kayıtlı kullanıcı',
    color: '#3B82F6',
    accent: 'rgba(59, 130, 246, 0.12)',
    Icon: UserIcon,
  },
  {
    key: 'products',
    label: 'Toplam Ürün',
    description: 'Aktif ürün kaydı',
    color: '#10B981',
    accent: 'rgba(16, 185, 129, 0.14)',
    Icon: ProductIcon,
  },
  {
    key: 'categories',
    label: 'Kategori Sayısı',
    description: 'Ürün grupları',
    color: '#8B5CF6',
    accent: 'rgba(139, 92, 246, 0.15)',
    Icon: CategoryIcon,
  },
]

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      try {
        setLoading(true)
        setError('')
        const data = await api.getStats()
        if (isMounted) {
          setStats(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'İstatistikler yüklenirken bir hata oluştu.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Yönetim Özeti</p>
          <h2>Genel İstatistikler</h2>
          <p className="dashboard__description">
            Panonuzdaki temel kullanıcı, ürün ve kategori sayılarını buradan izleyebilirsiniz.
          </p>
        </div>
      </header>

      {error && <p className="dashboard__alert">{error}</p>}
      {!error && loading && <p className="dashboard__status">İstatistikler yükleniyor...</p>}

      <div className="dashboard__grid">
        {STAT_CARDS.map(({ key, label, description, color, accent, Icon }) => (
          <article key={key} className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-card__icon" style={{ color, backgroundColor: accent }}>
              <Icon />
            </div>
            <p className="stat-card__value">{loading ? '—' : stats[key] ?? 0}</p>
            <p className="stat-card__label">{label}</p>
            <p className="stat-card__description">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function UserIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM6 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"
      />
    </svg>
  )
}

function ProductIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h18l-1.5 9h-15L3 3Zm3 12h12v6H6v-6Zm3 0v6m6-6v6"
      />
    </svg>
  )
}

function CategoryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 13h6v6H4v-6Zm10 4h6v2h-6v-2Z"
      />
    </svg>
  )
}

export default Dashboard
