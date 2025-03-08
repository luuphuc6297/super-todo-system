import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RoleService {
  constructor(private readonly configService: ConfigService) {}

  getRoles(): string[] {
    return this.configService.get<string[]>('auth.roles') || []
  }

  hasRole(userRoles: string[], requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    if (!userRoles || userRoles.length === 0) {
      return false
    }

    return requiredRoles.some((role) => userRoles.includes(role))
  }

  checkRole(userRole: string, requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    if (!userRole) {
      return false
    }

    return requiredRoles.includes(userRole)
  }
}
