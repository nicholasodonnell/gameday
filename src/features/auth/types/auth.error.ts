import { ApplicationException, ApplicationExceptionOptions } from '@/common/errors'

export class AuthException extends ApplicationException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Auth error', options)
  }
}
