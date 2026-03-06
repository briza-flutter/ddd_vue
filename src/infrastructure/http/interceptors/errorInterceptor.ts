import type { AxiosError, AxiosResponse } from 'axios'

export function errorInterceptor(
  onErrorCallback: (error: AxiosError) => void,
): [onFulfilled: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>, onRejected: (error: AxiosError) => Promise<never>] {
  return [
    (response) => response,
    (error) => {
      onErrorCallback(error)
      return Promise.reject(error)
    },
  ]
}
