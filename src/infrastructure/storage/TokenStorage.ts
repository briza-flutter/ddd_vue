import { Injectable } from "../../config/di";
import { User } from "../../domain/auth/entities/User";
import { LocalAuthStorage } from "../../domain/auth/repositories/localAuthStorage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

@Injectable({ as: LocalAuthStorage })
export class TokenStorage implements LocalAuthStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
  getUser(): User | null {
    return localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY)!)
      : null;
  }
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}
