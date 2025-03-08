import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from '../../../../../src/infrastructures/authentication/services/role.service'

describe('RoleService', () => {
  let service: RoleService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'auth.roles') return ['admin', 'user', 'guest']
              return null
            }),
          },
        },
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getRoles', () => {
    it('should return roles from config', () => {
      const result = service.getRoles()

      expect(configService.get).toHaveBeenCalledWith('auth.roles')
      expect(result).toEqual(['admin', 'user', 'guest'])
    })

    it('should return empty array if no roles in config', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null)

      const result = service.getRoles()

      expect(result).toEqual([])
    })
  })

  describe('hasRole', () => {
    it('should return true if user has required role', () => {
      const userRoles = ['admin', 'user']
      const requiredRoles = ['admin']

      const result = service.hasRole(userRoles, requiredRoles)

      expect(result).toBe(true)
    })

    it('should return true if no required roles', () => {
      const userRoles = ['admin', 'user']
      const requiredRoles: string[] = []

      const result = service.hasRole(userRoles, requiredRoles)

      expect(result).toBe(true)
    })

    it('should return false if user does not have required role', () => {
      const userRoles = ['user']
      const requiredRoles = ['admin']

      const result = service.hasRole(userRoles, requiredRoles)

      expect(result).toBe(false)
    })

    it('should return false if user has no roles', () => {
      const userRoles: string[] = []
      const requiredRoles = ['admin']

      const result = service.hasRole(userRoles, requiredRoles)

      expect(result).toBe(false)
    })
  })

  describe('checkRole', () => {
    it('should return true if user role matches required role', () => {
      const userRole = 'admin'
      const requiredRoles = ['admin', 'superadmin']

      const result = service.checkRole(userRole, requiredRoles)

      expect(result).toBe(true)
    })

    it('should return true if no required roles', () => {
      const userRole = 'admin'
      const requiredRoles: string[] = []

      const result = service.checkRole(userRole, requiredRoles)

      expect(result).toBe(true)
    })

    it('should return false if user role does not match required roles', () => {
      const userRole = 'user'
      const requiredRoles = ['admin', 'superadmin']

      const result = service.checkRole(userRole, requiredRoles)

      expect(result).toBe(false)
    })

    it('should return false if user has no role', () => {
      const userRole = ''
      const requiredRoles = ['admin']

      const result = service.checkRole(userRole, requiredRoles)

      expect(result).toBe(false)
    })
  })
})
