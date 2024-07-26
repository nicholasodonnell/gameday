import { ApplicationException, ApplicationExceptionOptions } from '@/common/errors'

export class GameException extends ApplicationException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Game error', options)
  }
}

export class NoLiveGameException extends GameException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'No live game', options)
  }
}
