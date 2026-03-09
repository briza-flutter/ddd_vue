import { AuthRepository } from "../../domain/auth/repositories/AuthRepository";
// import { AUTH_REPOSITORY } from '../../config/di/tokens'
import { Inject, Injectable } from "../../config/di";

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(AuthRepository) private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
    this.authRepository.clearUser();
  }
}
