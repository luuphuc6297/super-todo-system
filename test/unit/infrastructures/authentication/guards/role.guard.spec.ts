import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleGuard } from '../../../../../src/infrastructures/authentication/guards/role.guard'
import { RoleService } from '../../../../../src/infrastructures/authentication/services/role.service'

describe('RoleGuard', () => {
  let guard: RoleGuard
  let reflector: Reflector
  let roleService: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: {
            checkRole: jest.fn(),
          },
        },
      ],
    }).compile()

    guard = module.get<RoleGuard>(RoleGuard)
    reflector = module.get<Reflector>(Reflector)
    roleService = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true if no roles required', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(null)

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext

      const result = await guard.canActivate(mockContext)

      expect(reflector.get).toHaveBeenCalledWith('roles', mockContext.getHandler())
      expect(result).toBe(true)
    })

    it('should return true if user has required role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
      jest.spyOn(roleService, 'checkRole').mockReturnValue(true)

      const mockUser = { role: 'admin' }
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: mockUser }),
        }),
      } as unknown as ExecutionContext

      const result = await guard.canActivate(mockContext)

      expect(reflector.get).toHaveBeenCalledWith('roles', mockContext.getHandler())
      expect(roleService.checkRole).toHaveBeenCalledWith(mockUser.role, ['admin'])
      expect(result).toBe(true)
    })

    it('should throw ForbiddenException if user is not authenticated', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin'])

      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext

      await expect(guard.canActivate(mockContext)).rejects.toThrow(ForbiddenException)
      await expect(guard.canActivate(mockContext)).rejects.toThrow('User not authenticated')
    })

    it('should throw ForbiddenException if user does not have required role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
      jest.spyOn(roleService, 'checkRole').mockReturnValue(false)

      const mockUser = { role: 'user' }
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: mockUser }),
        }),
      } as unknown as ExecutionContext

      await expect(guard.canActivate(mockContext)).rejects.toThrow(ForbiddenException)
      await expect(guard.canActivate(mockContext)).rejects.toThrow('Insufficient permissions')
    })
  })
})
