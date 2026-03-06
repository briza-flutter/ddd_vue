import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type RequestInterceptor = [
  onFulfilled: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  onRejected?: (error: any) => any,
];

type ResponseInterceptor = [
  onFulfilled: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: any) => any,
];

export interface HttpClientOptions {
  baseURL: string;
  timeout?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

export class HttpClient {
  private readonly _axios: AxiosInstance;

  constructor(options: HttpClientOptions) {
    console.log("HttpClient initialized with options:", options);
    this._axios = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 10000,
      headers: { "Content-Type": "application/json" },
    });

    options.requestInterceptors?.forEach(([onFulfilled, onRejected]) => {
      this._axios.interceptors.request.use(onFulfilled, onRejected);
    });

    options.responseInterceptors?.forEach(([onFulfilled, onRejected]) => {
      this._axios.interceptors.response.use(onFulfilled, onRejected);
    });
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this._axios.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this._axios.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this._axios.put<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this._axios.delete<T>(url, config);
  }
}
