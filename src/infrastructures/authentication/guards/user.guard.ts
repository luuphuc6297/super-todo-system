import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../services/auth.service'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header')
    }

    const token = authHeader.split(' ')[1]

    try {
      const payload = await this.authService.validateToken(token)

      request.user = payload

      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
