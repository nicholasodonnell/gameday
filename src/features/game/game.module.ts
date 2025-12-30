import { Module } from '@nestjs/common'

import { MastApiModule } from '@/clients/mastapi'

import { GameService } from './game.service'

@Module({
  exports: [GameService],
  imports: [MastApiModule],
  providers: [GameService],
})
export class GameModule {}
