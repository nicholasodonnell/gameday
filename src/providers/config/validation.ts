import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'

class RequiredEnvironmentVariables {
  @IsString()
  public MLB_PASSWORD!: string

  @IsString()
  public MLB_USERNAME!: string

  @IsString()
  public NODE_ENV!: 'development' | 'production'
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(RequiredEnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
