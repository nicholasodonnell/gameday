import 'source-map-support/register'

import { join } from 'path'

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'

import { AppModule } from '@/app.module'
import { ErrorInterceptor } from '@/common/interceptors'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })

  app.enableShutdownHooks()
  app.useLogger(app.get(Logger))

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // interceptors
  app.useGlobalInterceptors(new ErrorInterceptor())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  // template
  app.useStaticAssets(join(__dirname, '../../', 'public'))
  app.setBaseViewsDir(join(__dirname, '../../', 'views'))
  app.setViewEngine('hbs')

  await app.listen(3000, '0.0.0.0')
}

bootstrap()
