import { Auth } from '@infras/authentication/decorators/auth.decorator'
import { CurrentUser } from '@infras/authentication/decorators/current-user.decorator'
import { Roles } from '@infras/authentication/decorators/roles.decorator'
import { JwtAuthGuard } from '@infras/authentication/guards/jwt.guard'
import { RoleGuard } from '@infras/authentication/guards/role.guard'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UpdateUserDto } from '../dtos/update-user.dto'
import { UserModel, UserRole } from '../models/user.model'
import { UserService } from '../services/user.service'

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() user: UserModel): Promise<UserModel> {
    return user
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<UserModel[]> {
    return this.userService.findAll()
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({
    status: 200,
    description: 'List of active users',
    type: [UserModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findActiveUsers(): Promise<UserModel[]> {
    return this.userService.findActiveUsers()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.findById(id)
  }

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    // Validate input data
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required')
    }

    // Check if email already exists
    const existingUser = await this.userService.findByEmail(createUserDto.email)
    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    return this.userService.create(createUserDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserModel> {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id)
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          example: UserRole.PAID,
        },
      },
      required: ['role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: { role: UserRole }
  ): Promise<UserModel> {
    return this.userService.updateRole(id, updateRoleDto.role)
  }
}
