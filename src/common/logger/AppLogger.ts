import { Injectable } from "../../config/di";

@Injectable()
export class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}
