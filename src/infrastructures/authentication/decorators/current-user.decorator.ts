import { UserModel } from '@modules/user/models/user.model'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)
