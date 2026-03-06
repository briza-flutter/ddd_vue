import { AxiosError } from "axios";
import { Inject, Injectable } from "injection-js";
import { LocalAuthStorage } from "../../domain/auth/repositories/localAuthStorage";
import { TokenStorageToken } from "../../infrastructure/storage/TokenStorage";

@Injectable()
export class InterceptorHandler {
  constructor(
    @Inject(TokenStorageToken) private localAuthStorage: LocalAuthStorage,
  ) {}

  getToken(): string | null {
    return this.localAuthStorage.getToken();
  }
  onErrorCallback(err: AxiosError): void {
    console.log("handle API Error:", err.message);
  }
}
