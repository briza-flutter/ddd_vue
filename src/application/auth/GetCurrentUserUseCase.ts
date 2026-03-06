import type { User } from '../../domain/auth/entities/User'
import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository'
import { AUTH_REPOSITORY } from '../../config/di/tokens'
import { Inject, Injectable } from '../../config/di'

@Injectable()
export class GetCurrentUserUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) { }

  execute(): User | null {
    return this.authRepository.getCurrentUser()
  }
}
