import { DynamicModule } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'

import { loader } from './loader'
import { validate } from './validation'

export class ConfigModule {
  public static async forRootAsync(): Promise<DynamicModule> {
    const configModule: DynamicModule = await NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [loader],
      validate,
    })

    return {
      exports: [configModule],
      imports: [configModule],
      module: ConfigModule,
    }
  }
}
