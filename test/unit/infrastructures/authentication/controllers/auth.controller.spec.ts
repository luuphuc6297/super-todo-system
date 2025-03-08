import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../../../../../src/infrastructures/authentication/controllers/auth.controller'
import { AuthService } from '../../../../../src/infrastructures/authentication/services/auth.service'
import { RoleService } from '../../../../../src/infrastructures/authentication/services/role.service'
import { LoginDto } from '../../../../../src/infrastructures/authentication/dtos/login.dto'
import { RegisterDto } from '../../../../../src/infrastructures/authentication/dtos/register.dto'
import { UserRole } from '../../../../../src/modules/user/models/user.model'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService
  let roleService: RoleService

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'Password123!',
  }

  const mockRegisterDto: RegisterDto = {
    email: 'newuser@example.com',
    password: 'Password123!',
    username: 'newuser',
    fullName: 'New User',
  }

  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'testuser',
    fullName: 'Test User',
    role: UserRole.FREE,
  }

  const mockLoginResponse = {
    accessToken: 'mock-jwt-token',
    user: mockUser,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(mockLoginResponse),
            register: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: RoleService,
          useValue: {
            getRoles: jest.fn().mockReturnValue(['admin', 'user']),
            checkRole: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    roleService = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should return login response with access token and user data', async () => {
      const result = await controller.login(mockLoginDto)

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto)
      expect(result).toEqual(mockLoginResponse)
    })
  })

  describe('register', () => {
    it('should return user data after successful registration', async () => {
      const result = await controller.register(mockRegisterDto)

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto)
      expect(result).toEqual(mockUser)
    })
  })

  describe('getProfile', () => {
    it('should return profile message', () => {
      const result = controller.getProfile()

      expect(result).toEqual({ message: 'This is your profile' })
    })
  })

  describe('adminOnly', () => {
    it('should return admin message', () => {
      const result = controller.adminOnly()

      expect(result).toEqual({ message: 'This is an admin only endpoint' })
    })
  })

  describe('userOnly', () => {
    it('should return user message', () => {
      const result = controller.userOnly()

      expect(result).toEqual({ message: 'This is a user only endpoint' })
    })
  })

  describe('publicEndpoint', () => {
    it('should return public message', () => {
      const result = controller.publicEndpoint()

      expect(result).toEqual({ message: 'This is a public endpoint' })
    })
  })
})
