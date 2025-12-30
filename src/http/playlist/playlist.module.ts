import { Module } from '@nestjs/common'

import { AuthModule } from '@/features/auth'
import { GameModule } from '@/features/game'
import { SessionModule } from '@/features/session'
import { StreamModule } from '@/features/stream'
import { TeamModule } from '@/features/team'

import { PlaylistController } from './playlist.controller'
import { PlaylistService } from './playlist.service'

@Module({
  controllers: [PlaylistController],
  imports: [AuthModule, GameModule, SessionModule, StreamModule, TeamModule],
  providers: [PlaylistService],
})
export class PlaylistModule {}
