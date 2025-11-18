import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/client'
import sanalMarketLogo from '../assets/sanal-market-logo.svg'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const token = localStorage.getItem('authToken')
  if (token) {
    return <Navigate to="/urun-listesi" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.login({ email, password })
      localStorage.setItem('authToken', response.access_token)
      navigate(location.state?.from?.pathname || '/urun-listesi', { replace: true })
    } catch (err) {
      setError(err.message || 'Giriş başarısız oldu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">
            <img src={sanalMarketLogo} alt="Sanal Market" />
          </div>
          <h1 className="login-card__title">Giriş Yap</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__group">
            <span>E-posta</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@sanalmarket.com"
              required
            />
          </label>

          <label className="login-form__group">
            <span>Şifre</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="form__error">{error}</p> : null}

          <button type="submit" className="button button--primary login-form__submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
