import { Injectable, Inject } from 'injection-js'
import type { User } from '../../domain/auth/entities/User'
import { Credentials } from '../../domain/auth/value-objects/Credentials'
import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository'
import { AUTH_REPOSITORY } from '../../config/di/tokens'

@Injectable()
export class LoginUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) { }

  async execute(credentials: Credentials): Promise<User> {
    const user = await this.authRepository.login(credentials)
    this.authRepository.persistUser(user)
    return user
  }
}
