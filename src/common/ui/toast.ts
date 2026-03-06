let container: HTMLDivElement | null = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;'
    document.body.appendChild(container)
  }
  return container
}

type ToastType = 'success' | 'error'

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: '#f0f9eb', border: '#e1f3d8', text: '#67c23a' },
  error: { bg: '#fef0f0', border: '#fde2e2', text: '#f56c6c' },
}

function show(message: string, type: ToastType, duration = 3000) {
  const el = document.createElement('div')
  const c = COLORS[type]
  el.textContent = message
  el.style.cssText = `padding:10px 20px;border-radius:6px;font-size:14px;background:${c.bg};border:1px solid ${c.border};color:${c.text};box-shadow:0 2px 12px rgba(0,0,0,.1);opacity:0;transition:opacity .3s;`
  getContainer().appendChild(el)
  requestAnimationFrame(() => (el.style.opacity = '1'))
  setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 300)
  }, duration)
}

export const toast = {
  success: (msg: string, duration?: number) => show(msg, 'success', duration),
  error: (msg: string, duration?: number) => show(msg, 'error', duration),
}
