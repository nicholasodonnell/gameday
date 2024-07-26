import { ApplicationException, ApplicationExceptionOptions } from '@/common/errors'

export class TeamNotFoundException extends ApplicationException {
  constructor(message?: string, options?: ApplicationExceptionOptions) {
    super(message ?? 'Team not found', options)
  }
}
