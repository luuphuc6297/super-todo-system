import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class HelperEncryptionService {
  private readonly encryptionKey: Buffer
  private readonly algorithm = 'aes-256-cbc'

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('helper.encryption.key')
    this.encryptionKey = crypto.scryptSync(key, 'salt', 32)
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${iv.toString('hex')}:${encrypted}`
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex')
  }

  hmac(text: string, secret?: string): string {
    const hmacSecret = secret || this.configService.get<string>('helper.encryption.hmacKey')
    return crypto.createHmac('sha256', hmacSecret).update(text).digest('hex')
  }

  randomBytes(size: number): string {
    return crypto.randomBytes(size).toString('hex')
  }

  uuid(): string {
    return uuidv4()
  }
}
