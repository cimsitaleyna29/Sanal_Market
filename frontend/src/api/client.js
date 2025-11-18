const BASE_URL = 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const { skipAuth = false, ...rest } = options

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
    ...rest,
  }

  if (!skipAuth) {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
    const message = data?.detail || data?.message || 'Bir hata oluştu.'
    throw new Error(message)
  }

  return data
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, skipAuth: true }),

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
  getStats: () => request('/stats/'),

  getUsers: () => request('/users/'),
  createUser: (payload) => request('/users/', { method: 'POST', body: payload }),
  updateUser: (userId, payload) => request(`/users/${userId}`, { method: 'PUT', body: payload }),
  deleteUser: (userId) => request(`/users/${userId}`, { method: 'DELETE' }),
  updateUserRole: (userId, newRole) =>
    request(`/users/${userId}/role?new_role=${encodeURIComponent(newRole)}`, { method: 'PUT' }),
  setUserSalary: (userId, payload) =>
    request(`/users/${userId}/salary`, { method: 'POST', body: payload }),
  getUserSalary: (userId) => request(`/users/${userId}/salary`),
}
