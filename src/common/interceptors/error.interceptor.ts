import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  public intercept<R = unknown>(_context: ExecutionContext, next: CallHandler): Observable<R> {
    return next.handle().pipe(
      catchError((err) => {
        const statusCode = this.getStatusCode(err)
        const message = this.getStatusMessage(err)

        return throwError(() => new HttpException(message, statusCode))
      }),
    )
  }

  private getStatusCode(e: Error): number {
    if (e instanceof HttpException) {
      return e.getStatus()
    }

    return e.cause instanceof Error ? this.getStatusCode(e.cause) : 500
  }

  private getStatusMessage(e: Error): object | Record<string, unknown> | string {
    if (e instanceof HttpException) {
      return e.getResponse()
    }

    return e.message ?? `An unexpected error occurred`
  }
}
