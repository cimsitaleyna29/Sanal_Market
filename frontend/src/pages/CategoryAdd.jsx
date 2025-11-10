import { useState } from 'react'
import { api } from '../api/client'

const initialForm = {
  name: '',
  description: '',
  imageUrl: '',
}

function CategoryAdd() {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [categories, setCategories] = useState([])
  const [showList, setShowList] = useState(false)
  const [listMessage, setListMessage] = useState('')
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const trimmedValues = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
      }

      if (!trimmedValues.name || !trimmedValues.description || !trimmedValues.imageUrl) {
        throw new Error('Lütfen tüm alanları doldurun')
      }

      const payload = {
        name: trimmedValues.name,
        description: trimmedValues.description,
        image_url: trimmedValues.imageUrl,
      }

      if (editingCategoryId) {
        await api.updateCategory(editingCategoryId, payload)
        setSuccessMessage('Kategori başarıyla güncellendi.')
        setEditingCategoryId(null)
      } else {
        await api.createCategory(payload)
        setSuccessMessage('Kategori başarıyla eklendi.')
      }

      setFormData(initialForm)
      if (showList) {
        await loadCategories()
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadCategories = async () => {
    setIsLoadingList(true)
    setListMessage('')
    try {
      const data = await api.getCategories()
      setCategories(data)
      if (!data.length) {
        setListMessage('Henüz kategori bulunmuyor.')
      }
    } catch (error) {
      setListMessage(error.message)
    } finally {
      setIsLoadingList(false)
    }
  }

  const toggleList = async () => {
    if (!showList) {
      await loadCategories()
    } else {
      setListMessage('')
    }
    setShowList((prev) => !prev)
  }

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')
    if (!confirmed) {
      return
    }

    try {
      await api.deleteCategory(categoryId)
      setListMessage('Kategori silindi.')
      if (editingCategoryId === categoryId) {
        setEditingCategoryId(null)
        setFormData(initialForm)
      }
      await loadCategories()
    } catch (error) {
      setListMessage(error.message)
    }
  }

  const startEditing = (category) => {
    setFormData({
      name: category.name ?? '',
      description: category.description ?? '',
      imageUrl: category.image_url ?? '',
    })
    setEditingCategoryId(category.id)
    setSuccessMessage('')
    setErrorMessage('')
    setListMessage('')
    if (!showList) {
      setShowList(true)
    }
  }

  const cancelEditing = () => {
    setEditingCategoryId(null)
    setFormData(initialForm)
  }

  const isEditing = Boolean(editingCategoryId)

  return (
    <section className="card">
      <header className="card__header">
        <div>
          <p className="card__eyebrow">Kategoriler</p>
          <h2>Kategori Ekle</h2>
        </div>
        <button className="button button--ghost" type="button" onClick={toggleList}>
          {showList ? 'Listeyi Gizle' : 'Kategori Listesini Gör'}
        </button>
      </header>

      {successMessage && <p className="alert alert--success">{successMessage}</p>}
      {errorMessage && <p className="alert alert--error">{errorMessage}</p>}

      <form className="form form--grid" onSubmit={handleSubmit}>
        <label className="form__group form__group--full">
          <span>Kategori Adı</span>
          <input
            type="text"
            name="name"
            placeholder="Örneğin: İçecekler"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label className="form__group form__group--full">
          <span>Açıklama</span>
          <textarea
            name="description"
            rows="3"
            placeholder="Bu kategori hakkında kısa bir açıklama yazın"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label className="form__group form__group--full">
          <span>Görsel URL</span>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </label>

        <div className="form__actions">
          {isEditing && (
            <button className="button button--ghost" type="button" onClick={cancelEditing}>
              Vazgeç
            </button>
          )}
          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>

      {showList && (
        <div className="card__section">
          {isLoadingList ? (
            <p>Kategoriler yükleniyor...</p>
          ) : (
            <>
              {listMessage && <p className="alert alert--info">{listMessage}</p>}
              {categories.length > 0 && (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Kategori Adı</th>
                        <th>Açıklama</th>
                        <th>Görsel</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>{category.name}</td>
                          <td>{category.description || '-'}</td>
                          <td>
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="table__thumbnail"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="table__actions">
                            <button
                              className="button button--ghost"
                              type="button"
                              onClick={() => startEditing(category)}
                            >
                              Düzenle
                            </button>
                            <button
                              className="button button--danger"
                              type="button"
                              onClick={() => handleDelete(category.id)}
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default CategoryAdd
