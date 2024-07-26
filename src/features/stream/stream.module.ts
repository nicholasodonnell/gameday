import { Module } from '@nestjs/common'

import { StreamService } from './stream.service'

import { MediaGatewayModule } from '@/clients/mediagateway'

@Module({
  exports: [StreamService],
  imports: [MediaGatewayModule],
  providers: [StreamService],
})
export class StreamModule {}
