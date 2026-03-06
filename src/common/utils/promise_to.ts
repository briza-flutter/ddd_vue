import { toast } from '../ui/toast'
import { showLoading, hideLoading } from '../ui/loading'

export interface UiConfig {
  /** 全屏 loading，默认 false */
  loading?: boolean
  /** 错误时 toast 提示，传 true 使用默认文案，传 string 自定义文案 */
  errorToast?: boolean | string
  /** 成功时 toast 提示，传 true 使用默认文案，传 string 自定义文案 */
  successToast?: boolean | string
}

export async function to<T>(
  promise: Promise<T>,
  ui?: UiConfig,
): Promise<[Error, null] | [null, T]> {
  if (ui?.loading) showLoading()

  try {
    const data = await promise
    if (ui?.successToast) {
      const msg = typeof ui.successToast === 'string' ? ui.successToast : '操作成功'
      toast.success(msg)
    }
    return [null, data]
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    if (ui?.errorToast) {
      const msg = typeof ui.errorToast === 'string' ? ui.errorToast : error.message
      toast.error(msg)
    }
    return [error, null]
  } finally {
    if (ui?.loading) hideLoading()
  }
}

declare global {
  interface Promise<T> {
    tryCatch(ui?: UiConfig): Promise<[Error, null] | [null, T]>
  }
}

Promise.prototype.tryCatch = function <T>(this: Promise<T>, ui?: UiConfig) {
  return to(this, ui)
}
