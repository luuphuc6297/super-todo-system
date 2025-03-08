import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    role: string
    username?: string
    fullName?: string
  }
}
