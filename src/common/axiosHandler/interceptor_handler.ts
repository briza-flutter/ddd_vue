import { AxiosError } from "axios";
import { Injectable } from "injection-js";

@Injectable()
export class InterceptorHandler {
  constructor() {}

  getToken(): string {
    return "mock-token-123456";
  }
  onErrorCallback(err: AxiosError): void {
    console.log("handle API Error:", err.message);
  }
}
