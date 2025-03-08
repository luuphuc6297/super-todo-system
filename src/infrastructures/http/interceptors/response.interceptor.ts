import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ResponseService } from '../services/response.service'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly responseService: ResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return data
        }

        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        let statusCode = response.statusCode

        if (request.method === 'POST' && statusCode === 200) {
          statusCode = 201
          response.status(statusCode)
        }

        if (statusCode >= 200 && statusCode < 300) {
          return this.responseService.success(data, {
            statusCode,
            message: this._getMessageByStatusCode(statusCode),
          })
        }

        return this.responseService.error({
          statusCode,
          message: this._getMessageByStatusCode(statusCode),
        })
      })
    )
  }

  private _getMessageByStatusCode(statusCode: number): string {
    const messages = {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    }

    return messages[statusCode] || 'Success'
  }
}
