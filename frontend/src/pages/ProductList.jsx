import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const computeFinalPrice = (priceValue, discountValue) => {
  const price = Number(priceValue)
  if (Number.isNaN(price)) {
    return ''
  }
  const discount = Number(discountValue)
  if (Number.isNaN(discount)) {
    return price.toFixed(2)
  }
  const finalValue = price - price * (discount / 100)
  return (finalValue < 0 ? 0 : finalValue).toFixed(2)
}

const toDatetimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (num) => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [editErrors, setEditErrors] = useState({})

  const loadData = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const [productData, categoryData] = await Promise.all([api.getProducts(), api.getCategories()])
      setProducts(productData)
      setCategories(categoryData)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name
      return acc
    }, {})
  }, [categories])

  const editingFinalPrice = useMemo(() => {
    if (!editingProduct) return ''
    return computeFinalPrice(editingProduct.price, editingProduct.discount_rate)
  }, [editingProduct?.price, editingProduct?.discount_rate])

  const startEditing = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name ?? '',
      brand: product.brand ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      discount_rate: product.discount_rate ?? '',
      stock: product.stock ?? '',
      unit: product.unit ?? 'adet',
      barcode: product.barcode ?? '',
      expiration_date: toDatetimeLocal(product.expiration_date),
      image_url: product.image_url ?? '',
      category_id: product.category_id ?? '',
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
    })
    setEditErrors({})
    setFeedbackMessage('')
    setErrorMessage('')
  }

  const cancelEditing = () => {
    setEditingProduct(null)
    setEditErrors({})
  }

  const handleInputChange = (event) => {
    if (!editingProduct) return
    const { name, value, type, checked } = event.target
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (editErrors[name]) {
      setEditErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const confirmAndDelete = async (productId) => {
    const onay = window.confirm('Bu ürünü silmek istediğinize emin misiniz?')
    if (!onay) {
      return
    }

    setProcessingId(productId)
    setErrorMessage('')
    setFeedbackMessage('')

    try {
      await api.deleteProduct(productId)
      setFeedbackMessage('Ürün başarıyla silindi.')
      await loadData()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const submitUpdate = async (event) => {
    event.preventDefault()
    if (!editingProduct) return

    setIsSubmitting(true)
    setErrorMessage('')
    setFeedbackMessage('')
    const trimmed = {
      name: editingProduct.name?.trim() ?? '',
      brand: editingProduct.brand?.trim() ?? '',
      description: editingProduct.description?.trim() ?? '',
      unit: editingProduct.unit?.trim() ?? '',
      barcode: editingProduct.barcode?.trim() ?? '',
      image_url: editingProduct.image_url?.trim() ?? '',
    }

    const validationErrors = {}

    if (!trimmed.name) validationErrors.name = 'Bu alan zorunludur'
    if (!trimmed.brand) validationErrors.brand = 'Bu alan zorunludur'
    if (!trimmed.description) validationErrors.description = 'Bu alan zorunludur'
    if (!trimmed.unit) validationErrors.unit = 'Bu alan zorunludur'
    if (!trimmed.barcode) validationErrors.barcode = 'Bu alan zorunludur'
    if (!trimmed.image_url) validationErrors.image_url = 'Bu alan zorunludur'

    const price = Number(editingProduct.price)
    if (editingProduct.price === '' || Number.isNaN(price) || price <= 0) {
      validationErrors.price = 'Bu alan zorunludur'
    }

    const discountRate = Number(editingProduct.discount_rate)
    if (editingProduct.discount_rate === '' || Number.isNaN(discountRate) || discountRate < 0) {
      validationErrors.discount_rate = 'Bu alan zorunludur'
    }

    const stock = Number(editingProduct.stock)
    if (editingProduct.stock === '' || Number.isNaN(stock) || stock < 0) {
      validationErrors.stock = 'Bu alan zorunludur'
    }

    const expirationDateValue = editingProduct.expiration_date
    const expirationDateObj = expirationDateValue ? new Date(expirationDateValue) : null
    if (!expirationDateValue || !expirationDateObj || Number.isNaN(expirationDateObj.getTime())) {
      validationErrors.expiration_date = 'Bu alan zorunludur'
    }

    const categoryId = Number(editingProduct.category_id)
    if (editingProduct.category_id === '' || Number.isNaN(categoryId)) {
      validationErrors.category_id = 'Bu alan zorunludur'
    }

    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors)
      setErrorMessage('Lütfen tüm alanları doldurun.')
      setIsSubmitting(false)
      return
    }

    try {
      const finalPriceValue = Number(editingFinalPrice)
      const payload = {
        name: trimmed.name,
        brand: trimmed.brand,
        description: trimmed.description,
        price,
        discount_rate: discountRate,
        final_price: Number.isNaN(finalPriceValue) ? price : finalPriceValue,
        stock,
        unit: trimmed.unit || 'adet',
        barcode: trimmed.barcode,
        expiration_date: expirationDateObj.toISOString(),
        is_active: Boolean(editingProduct.is_active),
        is_featured: Boolean(editingProduct.is_featured),
        image_url: trimmed.image_url,
        category_id: categoryId,
      }

      await api.updateProduct(editingProduct.id, payload)
      setFeedbackMessage('Ürün başarıyla güncellendi.')
      setEditErrors({})
      setEditingProduct(null)
      await loadData()
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (value) => {
    if (value === null || value === undefined) return '-'
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(numericValue)
  }

  return (
    <section className="card">
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Ürünler</p>
          <h2>Ürün Listesi</h2>
        </div>
        <button className="button button--ghost" type="button" onClick={loadData} disabled={loading}>
          Yenile
        </button>
      </header>

      {feedbackMessage && <p className="alert alert--success">{feedbackMessage}</p>}
      {errorMessage && <p className="alert alert--error">{errorMessage}</p>}

      {loading ? (
        <p>Veriler yükleniyor...</p>
      ) : products.length === 0 ? (
        <p>Henüz ürün bulunmuyor.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Görsel</th>
                <th>Fiyat</th>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="table__thumbnail" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{categoryMap[product.category_id] || `#${product.category_id ?? '-'}`}</td>
                  <td className="table__description">{product.description || '-'}</td>
                  <td className="table__actions">
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => startEditing(product)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="button button--danger"
                      type="button"
                      onClick={() => confirmAndDelete(product.id)}
                      disabled={processingId === product.id}
                    >
                      {processingId === product.id ? 'Siliniyor...' : 'Sil'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingProduct && (
        <form className="form form--grid form--divider" onSubmit={submitUpdate} noValidate>
          <h3>Ürünü Güncelle</h3>

          <label className="form__group">
            <span>Ürün Adı</span>
            <input
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={handleInputChange}
            />
            {editErrors.name && <span className="form__error">{editErrors.name}</span>}
          </label>

          <label className="form__group">
            <span>Marka</span>
            <input
              type="text"
              name="brand"
              value={editingProduct.brand}
              onChange={handleInputChange}
            />
            {editErrors.brand && <span className="form__error">{editErrors.brand}</span>}
          </label>

          <label className="form__group">
            <span>Fiyat (₺)</span>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={editingProduct.price}
              onChange={handleInputChange}
            />
            {editErrors.price && <span className="form__error">{editErrors.price}</span>}
          </label>

          <label className="form__group">
            <span>İndirim Oranı (%)</span>
            <input
              type="number"
              name="discount_rate"
              min="0"
              max="100"
              step="0.01"
              value={editingProduct.discount_rate}
              onChange={handleInputChange}
            />
            {editErrors.discount_rate && (
              <span className="form__error">{editErrors.discount_rate}</span>
            )}
          </label>

          <label className="form__group">
            <span>Son Fiyat (₺)</span>
            <input type="text" name="final_price" value={editingFinalPrice} readOnly placeholder="0.00" />
          </label>

          <label className="form__group">
            <span>Stok Miktarı</span>
            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              value={editingProduct.stock}
              onChange={handleInputChange}
            />
            {editErrors.stock && <span className="form__error">{editErrors.stock}</span>}
          </label>

          <label className="form__group">
            <span>Birim</span>
            <input
              type="text"
              name="unit"
              value={editingProduct.unit}
              onChange={handleInputChange}
            />
            {editErrors.unit && <span className="form__error">{editErrors.unit}</span>}
          </label>

          <label className="form__group">
            <span>Barkod</span>
            <input
              type="text"
              name="barcode"
              value={editingProduct.barcode}
              onChange={handleInputChange}
            />
            {editErrors.barcode && <span className="form__error">{editErrors.barcode}</span>}
          </label>

          <label className="form__group">
            <span>Son Kullanma Tarihi</span>
            <input
              type="datetime-local"
              name="expiration_date"
              value={editingProduct.expiration_date}
              onChange={handleInputChange}
            />
            {editErrors.expiration_date && (
              <span className="form__error">{editErrors.expiration_date}</span>
            )}
          </label>

          <label className="form__group">
            <span>Kategori</span>
            <select
              name="category_id"
              value={editingProduct.category_id}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">{loading ? 'Yükleniyor...' : 'Kategori seçin'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {editErrors.category_id && <span className="form__error">{editErrors.category_id}</span>}
          </label>

          <label className="form__group form__group--full">
            <span>Açıklama</span>
            <textarea
              name="description"
              rows="3"
              value={editingProduct.description}
              onChange={handleInputChange}
            />
            {editErrors.description && <span className="form__error">{editErrors.description}</span>}
          </label>

          <label className="form__group form__group--full">
            <span>Görsel URL</span>
            <input
              type="url"
              name="image_url"
              value={editingProduct.image_url}
              onChange={handleInputChange}
            />
            {editErrors.image_url && <span className="form__error">{editErrors.image_url}</span>}
          </label>

          <label className="form__group form__group--inline">
            <input
              type="checkbox"
              name="is_active"
              checked={Boolean(editingProduct.is_active)}
              onChange={handleInputChange}
            />
            <span>Aktif mi?</span>
          </label>

          <label className="form__group form__group--inline">
            <input
              type="checkbox"
              name="is_featured"
              checked={Boolean(editingProduct.is_featured)}
              onChange={handleInputChange}
            />
            <span>Öne çıkan ürün mü?</span>
          </label>

          <div className="form__actions">
            <button className="button button--ghost" type="button" onClick={cancelEditing}>
              Vazgeç
            </button>
            <button className="button button--primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default ProductList
