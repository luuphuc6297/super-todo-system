import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { ApiKeyService } from '../../../../../src/infrastructures/authentication/services/api-key.service'

describe('ApiKeyService', () => {
  let service: ApiKeyService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'auth.apiKeys') return ['valid-api-key-1', 'valid-api-key-2']
              return null
            }),
          },
        },
      ],
    }).compile()

    service = module.get<ApiKeyService>(ApiKeyService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateApiKey', () => {
    it('should generate a UUID v4 API key', () => {
      const apiKey = service.generateApiKey()

      // UUID v4 format regex
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

      expect(apiKey).toMatch(uuidV4Regex)
    })

    it('should generate unique API keys on each call', () => {
      const apiKey1 = service.generateApiKey()
      const apiKey2 = service.generateApiKey()

      expect(apiKey1).not.toEqual(apiKey2)
    })
  })

  describe('validateApiKey', () => {
    it('should return true for valid API key', () => {
      const result = service.validateApiKey('valid-api-key-1')

      expect(configService.get).toHaveBeenCalledWith('auth.apiKeys')
      expect(result).toBe(true)
    })

    it('should return false for invalid API key', () => {
      const result = service.validateApiKey('invalid-api-key')

      expect(configService.get).toHaveBeenCalledWith('auth.apiKeys')
      expect(result).toBe(false)
    })

    it('should return false if no API keys configured', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null)

      const result = service.validateApiKey('valid-api-key-1')

      expect(result).toBe(false)
    })
  })
})
