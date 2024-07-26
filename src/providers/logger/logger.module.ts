import type { IncomingMessage, ServerResponse } from 'http'

import { DynamicModule, Module, RequestMethod } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { v4 as uuid } from 'uuid'

import { ConfigModule } from '@/providers/config'

const loggerModule: DynamicModule = PinoLoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const dev = config.get('NODE_ENV') === 'development'
    const logLevel = config.get('LOG_LEVEL')

    return {
      exclude: ['/health', '/favicon.ico'],
      forRoutes: [{ method: RequestMethod.ALL, path: '*' }],
      pinoHttp: {
        base: undefined,
        customErrorMessage: (req: IncomingMessage) =>
          `--> ${req.method} ${(req as Request).originalUrl} - ${req.id as string}`,
        customLogLevel: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn'
          } else if (res.statusCode >= 500 || err) {
            return 'error'
          }

          return 'info'
        },
        customProps: (req: IncomingMessage) => {
          return {
            id: req.id as string,
          }
        },
        customReceivedMessage: (req: IncomingMessage) =>
          `<-- ${req.method} ${(req as Request).originalUrl} - ${req.id as string}`,
        customSuccessMessage: (req: IncomingMessage) =>
          `--> ${req.method} ${(req as Request).originalUrl} - ${req.id as string}`,
        genReqId: (req: IncomingMessage, res: ServerResponse) => {
          const existingID = req.id ?? req.headers['x-request-id']
          if (existingID) return existingID

          const requestId = uuid()
          res.setHeader('x-request-id', requestId)

          return requestId
        },
        level: (dev ? 'debug' : logLevel) as pino.Level,
        messageKey: 'msg',
        serializers: {
          err: pino.stdSerializers.err,
          req: pino.stdSerializers.req,
          res: pino.stdSerializers.res,
        },
        transport: {
          options: {
            colorize: true,
            levelFirst: true,
            singleLine: true,
          },
          target: 'pino-pretty',
        },
        wrapSerializers: true,
      },
    }
  },
})

@Module({
  exports: [loggerModule],
  imports: [loggerModule],
})
export class LoggerModule {}
