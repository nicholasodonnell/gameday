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

  public getMeta(): Record<string, any> {
    return this.meta
  }
}
