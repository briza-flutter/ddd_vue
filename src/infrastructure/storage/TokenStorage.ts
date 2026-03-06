const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export class TokenStorage {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  }

  static clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  }

  static getUser(): string | null {
    return localStorage.getItem(USER_KEY)
  }

  static setUser(user: string): void {
    localStorage.setItem(USER_KEY, user)
  }

  static clearUser(): void {
    localStorage.removeItem(USER_KEY)
  }
}
