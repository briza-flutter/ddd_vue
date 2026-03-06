let overlay: HTMLDivElement | null = null
let count = 0

export function showLoading() {
  count++
  if (overlay) return
  overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.7);'
  overlay.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
    <div style="width:36px;height:36px;border:3px solid #e5e7eb;border-top-color:#409eff;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <span style="color:#606266;font-size:14px;">加载中...</span>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`
  document.body.appendChild(overlay)
}

export function hideLoading() {
  if (--count <= 0) {
    count = 0
    overlay?.remove()
    overlay = null
  }
}
