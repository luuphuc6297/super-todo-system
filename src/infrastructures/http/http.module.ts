import { Module } from '@nestjs/common'
import { RequestInterceptor } from './interceptors/request.interceptor'
import { ResponsePagingInterceptor } from './interceptors/response-paging.interceptor'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { PaginationService } from './services/pagination.service'
import { RequestService } from './services/request.service'
import { ResponseService } from './services/response.service'

@Module({
  providers: [
    PaginationService,
    RequestService,
    ResponseService,
    RequestInterceptor,
    ResponseInterceptor,
    ResponsePagingInterceptor,
  ],
  exports: [
    PaginationService,
    RequestService,
    ResponseService,
    RequestInterceptor,
    ResponseInterceptor,
    ResponsePagingInterceptor,
  ],
})
export class HttpModule {}
