import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const initialForm = {
  name: '',
  brand: '',
  description: '',
  price: '',
  discountRate: '',
  stock: '',
  unit: 'adet',
  barcode: '',
  expirationDate: '',
  imageUrl: '',
  categoryId: '',
  isActive: true,
  isFeatured: false,
}

const getFinalPrice = (priceValue, discountValue) => {
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

function ProductAdd() {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const finalPriceDisplay = useMemo(
    () => getFinalPrice(formData.price, formData.discountRate),
    [formData.price, formData.discountRate],
  )

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      setErrorMessage('')
      try {
        const data = await api.getCategories()
        setCategories(data)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    const trimmed = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      description: formData.description.trim(),
      unit: formData.unit.trim(),
      barcode: formData.barcode.trim(),
      imageUrl: formData.imageUrl.trim(),
    }

    if (!trimmed.name) newErrors.name = 'Bu alan zorunludur'
    if (!trimmed.brand) newErrors.brand = 'Bu alan zorunludur'
    if (!trimmed.description) newErrors.description = 'Bu alan zorunludur'
    if (!trimmed.unit) newErrors.unit = 'Bu alan zorunludur'
    if (!trimmed.barcode) newErrors.barcode = 'Bu alan zorunludur'
    if (!trimmed.imageUrl) newErrors.imageUrl = 'Bu alan zorunludur'

    const price = Number(formData.price)
    if (formData.price === '' || Number.isNaN(price) || price <= 0) {
      newErrors.price = 'Bu alan zorunludur'
    }

    const discountRate = Number(formData.discountRate)
    if (formData.discountRate === '' || Number.isNaN(discountRate) || discountRate < 0) {
      newErrors.discountRate = 'Bu alan zorunludur'
    }

    const stock = Number(formData.stock)
    if (formData.stock === '' || Number.isNaN(stock) || stock < 0) {
      newErrors.stock = 'Bu alan zorunludur'
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Bu alan zorunludur'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Bu alan zorunludur'
    }

    return { newErrors, price, discountRate, stock, trimmed }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    const { newErrors, price, discountRate, stock, trimmed } = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const finalPriceValue = Number(finalPriceDisplay)
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
        expiration_date: new Date(formData.expirationDate).toISOString(),
        is_active: formData.isActive,
        is_featured: formData.isFeatured,
        image_url: trimmed.imageUrl,
        category_id: Number(formData.categoryId),
      }

      await api.createProduct(payload)
      setSuccessMessage('Ürün başarıyla eklendi.')
      setFormData(initialForm)
      setErrors({})
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="card">
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Ürünler</p>
          <h2>Yeni Ürün Ekle</h2>
        </div>
      </header>

      {successMessage && <p className="alert alert--success">{successMessage}</p>}
      {errorMessage && <p className="alert alert--error">{errorMessage}</p>}

      <form className="form form--grid" onSubmit={handleSubmit} noValidate>
        <label className="form__group">
          <span>Ürün Adı</span>
          <input
            type="text"
            name="name"
            placeholder="Örn: Organik Süt 1L"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </label>

        <label className="form__group">
          <span>Marka</span>
          <input
            type="text"
            name="brand"
            placeholder="Örn: Doğa Süt"
            value={formData.brand}
            onChange={handleChange}
          />
          {errors.brand && <span className="form__error">{errors.brand}</span>}
        </label>

        <label className="form__group">
          <span>Fiyat (₺)</span>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            placeholder="Örn: 64.90"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="form__error">{errors.price}</span>}
        </label>

        <label className="form__group">
          <span>İndirim Oranı (%)</span>
          <input
            type="number"
            name="discountRate"
            min="0"
            max="100"
            step="0.01"
            placeholder="Örn: 10"
            value={formData.discountRate}
            onChange={handleChange}
          />
          {errors.discountRate && <span className="form__error">{errors.discountRate}</span>}
        </label>

        <label className="form__group">
          <span>Son Fiyat (₺)</span>
          <input
            type="text"
            name="finalPrice"
            value={finalPriceDisplay}
            readOnly
            placeholder="0.00"
          />
        </label>

        <label className="form__group">
          <span>Stok Miktarı</span>
          <input
            type="number"
            name="stock"
            min="0"
            step="1"
            placeholder="Örn: 120"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <span className="form__error">{errors.stock}</span>}
        </label>

        <label className="form__group">
          <span>Birim</span>
          <input
            type="text"
            name="unit"
            placeholder="Örn: adet"
            value={formData.unit}
            onChange={handleChange}
          />
          {errors.unit && <span className="form__error">{errors.unit}</span>}
        </label>

        <label className="form__group">
          <span>Barkod</span>
          <input
            type="text"
            name="barcode"
            placeholder="Örn: 8691234567890"
            value={formData.barcode}
            onChange={handleChange}
          />
          {errors.barcode && <span className="form__error">{errors.barcode}</span>}
        </label>

        <label className="form__group">
          <span>Son Kullanma Tarihi</span>
          <input
            type="datetime-local"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
          {errors.expirationDate && <span className="form__error">{errors.expirationDate}</span>}
        </label>

        <label className="form__group">
          <span>Kategori</span>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isLoadingCategories}
          >
            <option value="">{isLoadingCategories ? 'Yükleniyor...' : 'Kategori seçin'}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="form__error">{errors.categoryId}</span>}
        </label>

        <label className="form__group form__group--full">
          <span>Açıklama</span>
          <textarea
            name="description"
            rows="3"
            placeholder="Ürünü kısaca tanımlayın"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <span className="form__error">{errors.description}</span>}
        </label>

        <label className="form__group form__group--full">
          <span>Görsel URL</span>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://example.com/urun.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {errors.imageUrl && <span className="form__error">{errors.imageUrl}</span>}
        </label>

        <label className="form__group form__group--inline">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Aktif mi?</span>
        </label>

        <label className="form__group form__group--inline">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <span>Öne çıkan ürün mü?</span>
        </label>

        <div className="form__actions">
          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ProductAdd
