import { UserRole } from '@modules/user/models/user.model'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header')
    }

    try {
      const token = authHeader.split(' ')[1]

      const payload = await this.authService.validateToken(token)
      if (payload.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Admin access required')
      }
      request.user = payload

      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
