import type { User } from '../entities/User'
import type { Credentials } from '../value-objects/Credentials'

export interface AuthRepository {
  login(credentials: Credentials): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): User | null
  persistUser(user: User): void
  clearUser(): void
}
