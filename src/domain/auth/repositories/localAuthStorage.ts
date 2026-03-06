import { User } from "../entities/User";

/// 本地认证数据存储抽象
export abstract class LocalAuthStorage {
  abstract getToken(): string | null;
  abstract setToken(token: string): void;
  abstract clearToken(): void;
  abstract getUser(): User | null;
  abstract setUser(user: User): void;
  abstract clearUser(): void;
}
