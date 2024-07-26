import { Module } from '@nestjs/common'

import { CleanupService } from './cleanup.service'

import { AuthModule } from '@/features/auth'
import { StreamModule } from '@/features/stream'

@Module({
  exports: [CleanupService],
  imports: [AuthModule, StreamModule],
  providers: [CleanupService],
})
export class CleanupModule {}
