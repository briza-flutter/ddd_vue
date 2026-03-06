import { type Injector, type Provider } from 'injection-js'

export let injector: Injector

export function setInjector(i: Injector): void {
  injector = i
}

// 自定义 provider（useValue / useFactory / useExisting 等）
// generate:di 会自动将这里的配置合并到 register.ts
export const customProviders: Provider[] = [
  // { provide: API_BASE_URL, useValue: '/api' },
  // { provide: HttpClient, useFactory: () => new HttpClient() },
]

// 倒出所有injection-js相关的工具和装饰器，方便在应用中使用
export * from 'injection-js'