import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private getStatusCode(e: Error): number {
    if (e instanceof HttpException) {
      return e.getStatus()
    }

    return e.cause instanceof Error ? this.getStatusCode(e.cause) : 500
  }

  private getStatusMessage(e: Error, statusCode: number): Record<string, any> | string {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
      return `An unexpected error occurred`
    }

    if (e instanceof HttpException) {
      return e.getResponse()
    }

    return e.message ?? `An unexpected error occurred`
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const statusCode = this.getStatusCode(err)
        const message = this.getStatusMessage(err, statusCode)

        return throwError(() => new HttpException(message, statusCode))
      }),
    )
  }
}
