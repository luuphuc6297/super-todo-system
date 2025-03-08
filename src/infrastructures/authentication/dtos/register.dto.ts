import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({
    example: 'newuser',
    description: 'Username',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string

  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty({
    example: 'Password123!',
    description: 'Password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @ApiProperty({
    example: 'New User',
    description: 'Full name',
  })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string
}
