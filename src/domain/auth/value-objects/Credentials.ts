export class Credentials {
  readonly username: string
  readonly password: string

  private constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  /** 工厂方法 — 校验不通过直接抛异常 */
  static create(username: string, password: string): Credentials {
    const errors: string[] = []

    if (!username || username.trim().length === 0) {
      errors.push('用户名不能为空')
    } else if (username.trim().length < 3) {
      errors.push('用户名至少3个字符')
    } else if (username.trim().length > 32) {
      errors.push('用户名不能超过32个字符')
    }

    if (!password || password.length === 0) {
      errors.push('密码不能为空')
    } else if (password.length < 4) {
      errors.push('密码至少4个字符')
    } else if (password.length > 64) {
      errors.push('密码不能超过64个字符')
    }

    if (errors.length > 0) {
      throw new CredentialsValidationError(errors)
    }

    return new Credentials(username.trim(), password)
  }
}

export class CredentialsValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(errors.join('; '))
    this.name = 'CredentialsValidationError'
  }
}
