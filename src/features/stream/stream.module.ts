import { Module } from '@nestjs/common'

import { MediaGatewayModule } from '@/clients/mediagateway'

import { StreamService } from './stream.service'

@Module({
  exports: [StreamService],
  imports: [MediaGatewayModule],
  providers: [StreamService],
})
export class StreamModule {}
