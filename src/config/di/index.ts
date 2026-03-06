import { ReflectiveInjector, type Injector } from 'injection-js'

export let injector: Injector

export function setInjector(i: Injector): void {
  injector = i
}

export { ReflectiveInjector }
