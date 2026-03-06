import type { InternalAxiosRequestConfig } from 'axios'

export function authInterceptor(
  getToken: () => string | null,
): [(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig] {
  return [
    (config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
  ]
}
