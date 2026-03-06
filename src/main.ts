import 'reflect-metadata'
import './common/utils/promise_to'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './presentation/router'
import { registerDependencies } from './config/di/register'
import { useAuthStore } from './presentation/stores/authStore'
import './style.css'

// 注册所有依赖 — 必须在使用 store 之前
registerDependencies()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

router.beforeEach((to, _from, next) => {
  const isAuthenticated = authStore.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

app.mount('#app')
