export type ApplicationExceptionOptions = {
  [key: string]: any
  cause?: any
}

export class ApplicationException extends Error {
  public readonly meta: Record<string, any>

  constructor(message: string, { cause, ...meta }: ApplicationExceptionOptions = {}) {
    super(message, { cause })
    this.meta = meta
  }

  public getFullMessage(): string {
    if (this.cause instanceof ApplicationException) {
      return `${this.message}: ${this.cause.getFullMessage()}`
    }

    if (this.cause instanceof Error) {
      return `${this.message}: ${this.cause.message}`
    }

    return this.message
  }

  public getMeta(): Record<string, any> {
    return this.meta
  }
}
