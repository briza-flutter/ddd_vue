import type { User } from '../../domain/auth/entities/User'
import { Credentials } from '../../domain/auth/value-objects/Credentials'
import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository'
// import { httpClient } from '../http/httpClient'
import { TokenStorage } from '../storage/TokenStorage'
import { Injectable } from '../../config/di'

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  async login(credentials: Credentials): Promise<User> {
    // 模拟API调用 — 实际项目中替换为真实接口
    // const response = await httpClient.post('/auth/login', credentials)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (credentials.username === 'admin' && credentials.password === 'admin') {
      return {
        id: '1',
        username: credentials.username,
        token: 'mock-jwt-token-' + Date.now(),
      }
    }

    throw new Error('用户名或密码错误')
  }

  async logout(): Promise<void> {
    // 实际项目中调用后端登出接口
    // await httpClient.post('/auth/logout')
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  getCurrentUser(): User | null {
    const userJson = TokenStorage.getUser()
    if (!userJson) return null
    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  }

  persistUser(user: User): void {
    TokenStorage.setToken(user.token)
    TokenStorage.setUser(JSON.stringify(user))
  }

  clearUser(): void {
    TokenStorage.clearToken()
    TokenStorage.clearUser()
  }
}
