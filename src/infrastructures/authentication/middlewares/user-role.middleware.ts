import { UserRole } from '@modules/user/models/user.model'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class UserRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userRoleParam = req.query.userRole as string

    if (userRoleParam && Object.values(UserRole).includes(userRoleParam as UserRole)) {
      if (!req.user) {
        req.user = {}
      }

      ;(req.user as any).role = userRoleParam
    }

    next()
  }
}
