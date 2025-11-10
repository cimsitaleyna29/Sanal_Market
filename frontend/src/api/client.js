const BASE_URL = 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(`${BASE_URL}${path}`, config)

  let data = null
  const isJson = response.headers.get('content-type')?.includes('application/json')
  if (isJson) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Bir hata oluştu.'
    throw new Error(message)
  }

  return data
}

export const api = {
  getCategories: () => request('/categories/'),
  createCategory: (payload) => request('/categories/', { method: 'POST', body: payload }),
  updateCategory: (categoryId, payload) =>
    request(`/categories/${categoryId}`, { method: 'PUT', body: payload }),
  deleteCategory: (categoryId) => request(`/categories/${categoryId}`, { method: 'DELETE' }),

  getProducts: () => request('/products/'),
  createProduct: (payload) => request('/products/', { method: 'POST', body: payload }),
  updateProduct: (productId, payload) =>
    request(`/products/${productId}`, { method: 'PUT', body: payload }),
  deleteProduct: (productId) => request(`/products/${productId}`, { method: 'DELETE' }),
}
