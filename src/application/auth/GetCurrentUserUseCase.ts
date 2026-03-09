import { Inject, Injectable } from "../../config/di";
import { AUTH_REPOSITORY } from "../../config/di/tokens";
import type { User } from "../../domain/auth/entities/User";
import { type AuthRepository } from "../../domain/auth/repositories/AuthRepository";

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
  ) {}

  execute(): User | null {
    return this.authRepository.getCurrentUser();
  }
}
