import { Module } from '@nestjs/common'

import { MlbAuthService } from './mlbauth.service'

@Module({
  exports: [MlbAuthService],
  providers: [MlbAuthService],
})
export class MlbAuthModule {}
