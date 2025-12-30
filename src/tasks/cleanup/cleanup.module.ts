import { Module } from '@nestjs/common'

import { AuthModule } from '@/features/auth'
import { StreamModule } from '@/features/stream'

import { CleanupService } from './cleanup.service'

@Module({
  exports: [CleanupService],
  imports: [AuthModule, StreamModule],
  providers: [CleanupService],
})
export class CleanupModule {}
