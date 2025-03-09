import { UserRole } from '@modules/user/models/user.model'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class UserRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Read userRole from query parameter (e.g., ?userRole=free or ?userRole=paid)
    const userRoleFromQuery = req.query.userRole as string

    // Map the userRole from query to the actual UserRole enum
    let userRoleValue: UserRole | null = null

    if (userRoleFromQuery) {
      // Convert to lowercase for case-insensitive comparison
      const normalizedRole = userRoleFromQuery.toLowerCase()

      if (normalizedRole === 'free') {
        userRoleValue = UserRole.FREE
      } else if (normalizedRole === 'paid') {
        userRoleValue = UserRole.PAID
      } else if (Object.values(UserRole).includes(userRoleFromQuery as UserRole)) {
        // If it's already a valid UserRole enum value, use it directly
        userRoleValue = userRoleFromQuery as UserRole
      }
    }

    // If a valid userRole is found, assign it to request.user
    if (userRoleValue) {
      if (!req.user) {
        req.user = {}
      }

      ;(req.user as any).role = userRoleValue

      // Log for debugging
      console.log(`UserRoleMiddleware: Detected userRole ${userRoleValue} from URL query parameter`)
    }

    next()
  }
}
