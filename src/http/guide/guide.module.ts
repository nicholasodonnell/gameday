import { Module } from '@nestjs/common'

import { GameModule } from '@/features/game'

import { GuideController } from './guide.controller'
import { GuideService } from './guide.service'

@Module({
  controllers: [GuideController],
  imports: [GameModule],
  providers: [GuideService],
})
export class GuideModule {}
