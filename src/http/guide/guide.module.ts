import { Module } from '@nestjs/common'

import { GuideController } from './guide.controller'
import { GuideService } from './guide.service'

import { GameModule } from '@/features/game'

@Module({
  controllers: [GuideController],
  imports: [GameModule],
  providers: [GuideService],
})
export class GuideModule {}
