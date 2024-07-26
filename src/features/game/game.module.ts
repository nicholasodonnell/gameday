import { Module } from '@nestjs/common'

import { GameService } from './game.service'

import { MastApiModule } from '@/clients/mastapi'

@Module({
  exports: [GameService],
  imports: [MastApiModule],
  providers: [GameService],
})
export class GameModule {}
