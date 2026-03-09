// AUTO-GENERATED — do not edit manually
// Run `npm run generate:di` to regenerate
import { ReflectiveInjector } from 'injection-js'
import { setInjector, customProviders } from './index'
import { AUTH_REPOSITORY } from './tokens'
import { AuthRepositoryImpl } from '../../infrastructure/auth/AuthRepositoryImpl'
import { LocalAuthStorage } from '../../domain/auth/repositories/localAuthStorage'
import { TokenStorage } from '../../infrastructure/storage/TokenStorage'
import { GetCurrentUserUseCase } from '../../application/auth/GetCurrentUserUseCase'
import { LoginUseCase } from '../../application/auth/LoginUseCase'
import { LogoutUseCase } from '../../application/auth/LogoutUseCase'
import { InterceptorHandler } from '../../common/axiosHandler/interceptor_handler'
import { Logger } from '../../common/logger/AppLogger'

export function registerDependencies(): void {
  const i = ReflectiveInjector.resolveAndCreate([
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
    { provide: LocalAuthStorage, useClass: TokenStorage },
    GetCurrentUserUseCase,
    LoginUseCase,
    LogoutUseCase,
    InterceptorHandler,
    Logger,
    ...customProviders,
  ])

  setInjector(i)
}
