import { UserRole, UserStatus } from '../models/user.model'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    description: 'User password',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  fullName?: string

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus

  @ApiPropertyOptional({
    description: 'Email verification status',
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean
}
