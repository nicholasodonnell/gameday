import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { ApplicationException } from '@/common/errors'
import { AuthService } from '@/features/auth'
import { StreamService } from '@/features/stream'

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name)

  constructor(
    private readonly auth: AuthService,
    private readonly stream: StreamService,
  ) {}

  @Cron('0 5 * * *') // Every day at 5:00 AM
  public async handleTask(): Promise<void> {
    try {
      this.logger.log('Starting cleanup task...')

      const deletedTokens: number = await this.auth.deleteExpiredTokens()
      this.logger.debug({ count: deletedTokens }, `Deleted ${deletedTokens} expired token(s)`)

      const deletedStreams: number = await this.stream.deleteExpiredStreams()
      this.logger.debug({ count: deletedStreams }, `Deleted ${deletedStreams} expired streams(s)`)

      this.logger.log('Finished cleanup task')
    } catch (cause) {
      throw new ApplicationException('Failed to handle cleanup task', { cause })
    }
  }
}
