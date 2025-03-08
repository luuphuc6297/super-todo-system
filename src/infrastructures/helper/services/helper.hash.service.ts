import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class HelperHashService {
  private readonly saltRounds = 10

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds)
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText)
  }

  async hashWithSalt(plainText: string, salt: string): Promise<string> {
    return bcrypt.hash(plainText, salt)
  }

  async generateSalt(): Promise<string> {
    return bcrypt.genSalt(this.saltRounds)
  }
}
