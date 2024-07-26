import { Module } from '@nestjs/common'

import { MastApiService } from './mastapi.service'

@Module({
  exports: [MastApiService],
  providers: [MastApiService],
})
export class MastApiModule {}
