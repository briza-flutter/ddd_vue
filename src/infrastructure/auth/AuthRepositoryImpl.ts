import type { User } from "../../domain/auth/entities/User";
import type { AuthRepository } from "../../domain/auth/repositories/AuthRepository";
import { Credentials } from "../../domain/auth/value-objects/Credentials";
import { Inject, Injectable } from "../../config/di";
import { LocalAuthStorage } from "../../domain/auth/repositories/localAuthStorage";
import { HttpClient } from "../http/httpClient";
import { AUTH_REPOSITORY } from "../../config/di/tokens";

@Injectable({ as: AUTH_REPOSITORY })
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @Inject(HttpClient) private readonly httpClient: HttpClient,
    @Inject(LocalAuthStorage)
    private readonly localAuthStorage: LocalAuthStorage,
  ) {}
  async login(credentials: Credentials): Promise<User> {
    // 模拟API调用 — 实际项目中替换为真实接口
    const res = await this.httpClient.post("/app/user/login", {
      username: credentials.username,
      password: credentials.password,
    });
    return {
      id: res.data.id,
      username: res.data.username,
      token: res.data.token,
    };
  }

  async logout(): Promise<void> {
    // 实际项目中调用后端登出接口
    // await httpClient.post('/auth/logout')
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  getCurrentUser(): User | null {
    return this.localAuthStorage.getUser();
  }

  persistUser(user: User): void {
    this.localAuthStorage.setToken(user.token);
    this.localAuthStorage.setUser(user);
  }

  clearUser(): void {
    this.localAuthStorage.clearToken();
    this.localAuthStorage.clearUser();
  }
}
