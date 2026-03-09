import {
  Injectable as _Injectable,
  InjectionToken,
  type Injector,
  type Provider,
} from "injection-js";

// 扩展 Injectable 装饰器，支持 @Injectable({ as: AbstractClass }) 声明 DI token
// 生成器会解析 as 参数，自动生成 { provide: as, useClass: Class } 绑定
type ProvideToken =
  | (abstract new (...args: any[]) => any)
  | InjectionToken<any>;

export function Injectable(_options?: { as?: ProvideToken }): ClassDecorator {
  return _Injectable();
}
import { HttpClient } from "../../infrastructure/http/httpClient";
import { authInterceptor } from "../../infrastructure/http/interceptors/authInterceptor";
import { responseInterceptor } from "../../infrastructure/http/interceptors/responseInterceptor";
import { errorInterceptor } from "../../infrastructure/http/interceptors/errorInterceptor";
import { InterceptorHandler } from "../../common/axiosHandler/interceptor_handler";

export let di: Injector;

export function setInjector(i: Injector): void {
  di = i;
}

// 自定义 provider（useValue / useFactory / useExisting 等）
// generate:di 会自动将这里的配置合并到 register.ts
export const customProviders: Provider[] = [
  {
    provide: HttpClient,
    useFactory: (handler: InterceptorHandler) =>
      new HttpClient({
        baseURL: "https://rtznwl.com/ruitang",
        requestInterceptors: [authInterceptor(() => handler.getToken())],
        responseInterceptors: [
          responseInterceptor(),
          errorInterceptor(handler.onErrorCallback),
        ],
      }),
    deps: [InterceptorHandler],
  },
];
// 倒出所有injection-js相关的工具和装饰器，方便在应用中使用
export * from "injection-js";
