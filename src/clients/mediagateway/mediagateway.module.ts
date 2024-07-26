import { Module } from '@nestjs/common'

import { MediaGatewayService } from './mediagateway.service'

@Module({
  exports: [MediaGatewayService],
  providers: [MediaGatewayService],
})
export class MediaGatewayModule {}
