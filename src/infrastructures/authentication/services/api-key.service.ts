import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ApiKeyService {
  constructor(private readonly configService: ConfigService) {}

  generateApiKey(): string {
    return uuidv4()
  }

  validateApiKey(apiKey: string): boolean {
    const validApiKeys = this.configService.get<string[]>('auth.apiKeys') || []
    return validApiKeys.includes(apiKey)
  }
}
