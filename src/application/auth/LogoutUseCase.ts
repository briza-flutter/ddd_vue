import { Injectable, Inject } from 'injection-js'
import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository'
import { AUTH_REPOSITORY } from '../../config/di/tokens'

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) { }

  async execute(): Promise<void> {
    await this.authRepository.logout()
    this.authRepository.clearUser()
  }
}
