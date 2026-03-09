import type { User } from "../../domain/auth/entities/User";
import { Credentials } from "../../domain/auth/value-objects/Credentials";
import { AuthRepository } from "../../domain/auth/repositories/AuthRepository";
import { Logger } from "../../common/logger/AppLogger";
import { Inject, Injectable } from "../../config/di";
import { LocalAuthStorage } from "../../domain/auth/repositories/localAuthStorage";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AuthRepository) private authRepository: AuthRepository,
    @Inject(Logger) private logger: Logger,
    @Inject(LocalAuthStorage) private tokenStorage: LocalAuthStorage,
  ) {}

  async execute(credentials: Credentials): Promise<User> {
    const user = await this.authRepository.login(credentials);
    this.tokenStorage.setToken(user.token);
    this.authRepository.persistUser(user);
    this.logger.log("User logged in successfully");
    return user;
  }
}
