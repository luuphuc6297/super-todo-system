import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ResponseService } from '../services/response.service'

@Injectable()
export class ResponsePagingInterceptor implements NestInterceptor {
  constructor(private readonly responseService: ResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.statusCode) {
          return data
        }

        if (data && data.data && data.meta) {
          const { data: items, meta } = data

          return this.responseService.successWithPaging(items, {
            totalData: meta.total,
            totalPage: meta.totalPages,
            currentPage: meta.page,
            perPage: meta.perPage,
          })
        }

        return this.responseService.success(data)
      })
    )
  }
}
