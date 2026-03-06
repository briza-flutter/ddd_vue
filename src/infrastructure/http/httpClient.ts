import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { TokenStorage } from '../storage/TokenStorage'

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = TokenStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      TokenStorage.clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { httpClient }
