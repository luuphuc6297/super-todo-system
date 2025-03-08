import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { RequestService } from '../services/request.service'

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly requestService: RequestService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    this.requestService.setRequest(request)

    return next.handle()
  }
}
