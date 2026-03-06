import { type Injector, type Provider } from "injection-js";
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
        baseURL: "http://192.168.3.129:8080",
        requestInterceptors: [authInterceptor(() => handler.getToken())],
        responseInterceptors: [
          responseInterceptor(),
          errorInterceptor((error) => handler.onErrorCallback(error)),
        ],
      }),
    deps: [InterceptorHandler],
  },
];
// 倒出所有injection-js相关的工具和装饰器，方便在应用中使用
export * from "injection-js";
