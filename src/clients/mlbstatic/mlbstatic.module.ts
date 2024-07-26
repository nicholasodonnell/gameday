import { Module } from '@nestjs/common'

import { MlbStaticService } from './mlbstatic.service'

@Module({
  exports: [MlbStaticService],
  providers: [MlbStaticService],
})
export class MlbStaticModule {}
