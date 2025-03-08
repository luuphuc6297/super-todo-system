import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { LoginDto } from '../../../../../src/infrastructures/authentication/dtos/login.dto'
import { RegisterDto } from '../../../../../src/infrastructures/authentication/dtos/register.dto'
import { AuthService } from '../../../../../src/infrastructures/authentication/services/auth.service'
import { HelperHashService } from '../../../../../src/infrastructures/helper/services/helper.hash.service'
import { UserRole } from '../../../../../src/modules/user/models/user.model'
import { UserService } from '../../../../../src/modules/user/services/user.service'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let configService: ConfigService
  let userService: UserService
  let helperHashService: HelperHashService

  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    password: 'hashed-password',
    username: 'testuser',
    fullName: 'Test User',
    role: UserRole.FREE,
    status: 'active',
    lastLoginAt: new Date(),
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest
              .fn()
              .mockReturnValue({
                sub: 'user-id-1',
                email: 'test@example.com',
                role: UserRole.FREE,
              }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'auth.jwt.secret') return 'test-secret'
              if (key === 'auth.jwt.expiresIn') return '1h'
              return null
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn().mockImplementation((email: string) => {
              if (email === mockUser.email) return Promise.resolve(mockUser)
              return Promise.resolve(null)
            }),
            create: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
        {
          provide: HelperHashService,
          useValue: {
            compare: jest.fn().mockImplementation((plainPassword, hashedPassword) => {
              return Promise.resolve(
                plainPassword === 'Password123!' && hashedPassword === 'hashed-password'
              )
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    configService = module.get<ConfigService>(ConfigService)
    userService = module.get<UserService>(UserService)
    helperHashService = module.get<HelperHashService>(HelperHashService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createAccessToken', () => {
    it('should create a JWT token', async () => {
      const payload = { sub: 'user-id', email: 'test@example.com' }
      const result = await service.createAccessToken(payload)

      expect(jwtService.sign).toHaveBeenCalledWith(payload)
      expect(result).toBe('mock-jwt-token')
    })
  })

  describe('validateToken', () => {
    it('should validate and decode a JWT token', async () => {
      const token = 'valid-token'
      const result = await service.validateToken(token)

      expect(jwtService.verify).toHaveBeenCalledWith(token)
      expect(result).toEqual({ sub: 'user-id-1', email: 'test@example.com', role: UserRole.FREE })
    })

    it('should throw an error for invalid token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token')
      })

      await expect(service.validateToken('invalid-token')).rejects.toThrow()
    })
  })

  describe('login', () => {
    it('should return user data and access token for valid credentials', async () => {
      const result = await service.login(mockLoginDto)

      expect(userService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email)
      expect(helperHashService.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password
      )
      expect(jwtService.sign).toHaveBeenCalled()

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          username: mockUser.username,
          fullName: mockUser.fullName,
        },
      })
    })

    it('should throw UnauthorizedException for non-existent user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(helperHashService, 'compare').mockResolvedValue(false)

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)

      const result = await service.register(mockRegisterDto)

      expect(userService.findByEmail).toHaveBeenCalledWith(mockRegisterDto.email)
      expect(userService.create).toHaveBeenCalledWith({
        email: mockRegisterDto.email,
        password: mockRegisterDto.password,
        fullName: mockRegisterDto.fullName,
        role: UserRole.FREE,
        username: mockRegisterDto.username,
      })

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        username: mockUser.username,
        fullName: mockUser.fullName,
      })
    })

    it('should throw BadRequestException if email already exists', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)

      await expect(service.register(mockRegisterDto)).rejects.toThrow(BadRequestException)
    })
  })
})
