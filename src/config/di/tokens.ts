import { InjectionToken } from ".";
import type { AuthRepository } from "../../domain/auth/repositories/AuthRepository";
// 定义接口是interface，需要，定义依赖注入token是InjectionToken
// 抽象类可以直接用类作为token
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>(
  "AuthRepository",
);
