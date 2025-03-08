import { IsEmailUnique } from '@infras/validation/decorators/is-email-unique.decorator'
import { IsStrongPassword } from '@infras/validation/decorators/is-strong-password.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { UserRole, UserStatus } from '../models/user.model'

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsEmailUnique({
    message: 'Email is already in use, please choose another email',
  })
  email: string

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe',
  })
  @IsString()
  @IsOptional()
  username?: string

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword({
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string

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
    default: UserRole.FREE,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus

  @ApiPropertyOptional({
    description: 'Email verification status',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean
}
