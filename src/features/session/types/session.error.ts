import { ApplicationException, ApplicationExceptionOptions } from '@/common/errors'

export class SessionException extends ApplicationException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Session error', options)
  }
}
