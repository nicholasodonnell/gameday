import type { Knex } from 'knex'

import { DynamicModule, Module, OnModuleDestroy } from '@nestjs/common'
import { Provider } from '@nestjs/common/interfaces'
import { knex } from 'knex'

import knexFile from '../../../knexfile'

import { KNEX_TOKEN } from './knex.constants'
import { InjectKnex } from './knex.decorator'

const knexProvider: Provider<Knex> = {
  provide: KNEX_TOKEN,
  useValue: knex(knexFile),
}

@Module({
  providers: [knexProvider],
})
export class KnexModule implements OnModuleDestroy {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public static forRoot(): DynamicModule {
    return {
      exports: [KNEX_TOKEN],
      global: true,
      module: KnexModule,
      providers: [knexProvider],
    }
  }

  public async onModuleDestroy() {
    await this.knex.destroy()
  }
}
