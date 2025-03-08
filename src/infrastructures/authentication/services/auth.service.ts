import { UserRole } from '@modules/user/models/user.model'
import { UserService } from '@modules/user/services/user.service'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { HelperHashService } from '@infras/helper/services/helper.hash.service'
import { LoginDto, LoginResponse } from '../dtos/login.dto'
import { RegisterDto } from '../dtos/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly helperHashService: HelperHashService
  ) {}

  /**
   * Create a JWT access token from payload
   * @param payload - Data to encode in the token
   * @returns Promise containing the signed JWT token string
   */
  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.sign(payload)
  }

  /**
   * Validate and decode a JWT token
   * @param token - JWT token string to validate
   * @returns Promise containing the decoded data from the token
   * @throws JsonWebTokenError if token is invalid
   * @throws TokenExpiredError if token has expired
   */
  async validateToken(token: string): Promise<Record<string, any>> {
    return this.jwtService.verify(token)
  }

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(loginDto.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await this.helperHashService.compare(
      loginDto.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = await this.createAccessToken(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        fullName: user.fullName,
      },
    }
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.userService.findByEmail(registerDto.email)
    
    if (existingUser) {
      throw new BadRequestException('Email already exists')
    }

    // Generate username from email (remove domain part)
    const username = registerDto.email.split('@')[0]

    // Create new user with UserService
    const newUser = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      fullName: registerDto.fullName,
      role: UserRole.FREE,
      username: username,
    })

    // Return user data without sensitive information
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    }
  }
}
