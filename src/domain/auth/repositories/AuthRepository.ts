import type { User } from "../entities/User";
import type { Credentials } from "../value-objects/Credentials";

export abstract class AuthRepository {
  abstract login(credentials: Credentials): Promise<User>;
  abstract logout(): Promise<void>;
  abstract getCurrentUser(): User | null;
  abstract persistUser(user: User): void;
  abstract clearUser(): void;
}
