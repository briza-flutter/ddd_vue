import type { AxiosResponse } from 'axios'
import { AxiosError } from 'axios'

/**
 * 处理业务状态码：code !== 200 时转为错误
 */
export function responseInterceptor(): [
  (response: AxiosResponse) => AxiosResponse,
] {
  return [
    (response) => {
      const { code, msg } = response.data ?? {}
      if (code === 200) {
        return response
      }
      throw new AxiosError(
        `API Error: ${msg ?? 'Unknown error'}`,
        AxiosError.ERR_BAD_RESPONSE,
        response.config,
        response.request,
        response,
      )
    },
  ]
}
