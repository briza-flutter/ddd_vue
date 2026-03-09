import { Inject, Injectable } from "../../config/di";
import type { User } from "../../domain/auth/entities/User";
import { AuthRepository } from "../../domain/auth/repositories/AuthRepository";

@Injectable()
export class GetCurrentUserUseCase {
  constructor(@Inject(AuthRepository) private authRepository: AuthRepository) {}

  execute(): User | null {
    return this.authRepository.getCurrentUser();
  }
}
