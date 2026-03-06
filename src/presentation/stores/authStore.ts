import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../../domain/auth/entities/User'
import { Credentials } from '../../domain/auth/value-objects/Credentials'
import { injector } from '../../config/di'
import { LoginUseCase } from '../../application/auth/LoginUseCase'
import { LogoutUseCase } from '../../application/auth/LogoutUseCase'
import { GetCurrentUserUseCase } from '../../application/auth/GetCurrentUserUseCase'

export const useAuthStore = defineStore('auth', () => {
  const loginUseCase = injector.get<LoginUseCase>(LoginUseCase)
  const logoutUseCase = injector.get<LogoutUseCase>(LogoutUseCase)
  const getCurrentUserUseCase = injector.get<GetCurrentUserUseCase>(GetCurrentUserUseCase)

  const user = ref<User | null>(getCurrentUserUseCase.execute())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = () => user.value !== null

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const credentials = Credentials.create(username, password)
      user.value = await loginUseCase.execute(credentials)
    } catch (e: any) {
      error.value = e.message || '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await logoutUseCase.execute()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function initialize() {
    user.value = getCurrentUserUseCase.execute()
  }

  return { user, loading, error, isAuthenticated, login, logout, initialize }
})
