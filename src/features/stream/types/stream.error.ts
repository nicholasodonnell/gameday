import { ApplicationException, ApplicationExceptionOptions } from '@/common/errors'

export class StreamException extends ApplicationException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Stream error', options)
  }
}

export class BlackedOutException extends StreamException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Stream is blacked out', options)
  }
}
