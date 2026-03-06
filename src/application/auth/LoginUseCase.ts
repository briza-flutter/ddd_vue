import type { User } from '../../domain/auth/entities/User'
import { Credentials } from '../../domain/auth/value-objects/Credentials'
import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository'
import { AUTH_REPOSITORY } from '../../config/di/tokens'
import { Logger } from '../../common/logger/AppLogger'
import { Inject, Injectable } from '../../config/di'

@Injectable()
export class LoginUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository, @Inject(Logger) private logger: Logger) { }

  async execute(credentials: Credentials): Promise<User> {
    const user = await this.authRepository.login(credentials)
    this.authRepository.persistUser(user)
    this.logger.log('User logged in successfully')
    return user
  }
}
