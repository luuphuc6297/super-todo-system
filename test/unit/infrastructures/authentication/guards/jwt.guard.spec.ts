import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { JwtAuthGuard } from '../../../../../src/infrastructures/authentication/guards/jwt.guard'

interface MockRequest {
  headers: Record<string, string>
  user?: Record<string, any>
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ sub: 'user-id', email: 'test@example.com' }),
          },
        },
      ],
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true for valid token', () => {
      const mockRequest: MockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
        user: {}
      }

      const mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      })

      const result = guard.canActivate(mockContext)

      expect(jwtService.verify).toHaveBeenCalledWith('valid-token')
      expect(mockRequest.user).toEqual({ sub: 'user-id', email: 'test@example.com' })
      expect(result).toBe(true)
    })

    it('should throw UnauthorizedException if no token provided', () => {
      const mockRequest: MockRequest = {
        headers: {},
      }

      const mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      })

      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(mockContext)).toThrow('Access token not found')
    })

    it('should throw UnauthorizedException if token is invalid', () => {
      const mockRequest: MockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      }

      const mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      })

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token')
      })

      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(mockContext)).toThrow('Invalid access token')
    })
  })

  describe('extractTokenFromHeader', () => {
    it('should extract token from authorization header', () => {
      const mockRequest: MockRequest = {
        headers: {
          authorization: 'Bearer test-token',
        },
      }

      // @ts-ignore: Private method test
      const result = guard.extractTokenFromHeader(mockRequest as any)

      expect(result).toBe('test-token')
    })

    it('should return undefined if no authorization header', () => {
      const mockRequest: MockRequest = {
        headers: {},
      }

      // @ts-ignore: Private method test
      const result = guard.extractTokenFromHeader(mockRequest as any)

      expect(result).toBeUndefined()
    })

    it('should return undefined if not a Bearer token', () => {
      const mockRequest: MockRequest = {
        headers: {
          authorization: 'Basic test-token',
        },
      }

      // @ts-ignore: Private method test
      const result = guard.extractTokenFromHeader(mockRequest as any)

      expect(result).toBeUndefined()
    })
  })
})
