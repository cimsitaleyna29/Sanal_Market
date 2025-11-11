function PlaceholderPage({ title }) {
  return (
    <section className="card placeholder">
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Yapım Aşamasında</p>
          <h2>{title}</h2>
        </div>
      </header>
      <p className="placeholder__text">
        Bu sayfa üzerinde çalışmalar devam ediyor. İlgili yönetim bölümü yakında kullanıma açılacak.
      </p>
    </section>
  )
}

export default PlaceholderPage
