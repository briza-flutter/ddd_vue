// AUTO-GENERATED — do not edit manually
// Run `npm run generate:di` to regenerate
import { ReflectiveInjector } from 'injection-js'
import { setInjector } from './index'
import { AUTH_REPOSITORY } from './tokens'
import { AuthRepositoryImpl } from '../../infrastructure/auth/AuthRepositoryImpl'
import { GetCurrentUserUseCase } from '../../application/auth/GetCurrentUserUseCase'
import { LoginUseCase } from '../../application/auth/LoginUseCase'
import { LogoutUseCase } from '../../application/auth/LogoutUseCase'

export function registerDependencies(): void {
  const i = ReflectiveInjector.resolveAndCreate([
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
    GetCurrentUserUseCase,
    LoginUseCase,
    LogoutUseCase,
  ])

  setInjector(i)
}
