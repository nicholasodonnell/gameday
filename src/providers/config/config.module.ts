import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'

import { loader } from './loader'
import { validate } from './validation'

const configModule: DynamicModule = NestConfigModule.forRoot({
  cache: true,
  isGlobal: true,
  load: [loader],
  validate,
})

@Module({
  exports: [configModule],
  imports: [configModule],
})
export class ConfigModule {}
