import { AxiosError } from "axios";
import { Inject, Injectable } from "../../config/di";
import { LocalAuthStorage } from "../../domain/auth/repositories/localAuthStorage";

@Injectable()
export class InterceptorHandler {
  constructor(
    @Inject(LocalAuthStorage) private localAuthStorage: LocalAuthStorage,
  ) {}

  getToken(): string | null {
    return this.localAuthStorage.getToken();
  }
  onErrorCallback(err: AxiosError): void {
    console.log("handle API Error:", err.message);
  }
}
