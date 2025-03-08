import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginDto, LoginResponse } from '../dtos/login.dto'
import { RegisterDto } from '../dtos/register.dto'
import { AdminGuard } from '../guards/admin.guard'
import { UserGuard } from '../guards/user.guard'
import { AuthService } from '../services/auth.service'
import { RoleService } from '../services/role.service'

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto)
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Get('profile')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile() {
    return { message: 'This is your profile' }
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin only endpoint' })
  @ApiResponse({ status: 200, description: 'Admin access successful' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  adminOnly() {
    return { message: 'This is an admin only endpoint' }
  }

  @Get('user')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User only endpoint' })
  @ApiResponse({ status: 200, description: 'User access successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  userOnly() {
    return { message: 'This is a user only endpoint' }
  }

  @Get('public')
  @ApiOperation({ summary: 'Public endpoint' })
  @ApiResponse({ status: 200, description: 'Public access successful' })
  publicEndpoint() {
    return { message: 'This is a public endpoint' }
  }
}
