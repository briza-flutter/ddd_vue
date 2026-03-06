import { InjectionToken } from ".";
import type { AuthRepository } from "../../domain/auth/repositories/AuthRepository";

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>(
  "AuthRepository",
);
