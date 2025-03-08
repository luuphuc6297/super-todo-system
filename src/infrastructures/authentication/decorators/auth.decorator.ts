import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from 'src/modules/user/models/user.model'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { RoleGuard } from '../guards/role.guard'
import { Roles } from './roles.decorator'

export function Auth(...roles: UserRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RoleGuard), Roles(...roles))
}
