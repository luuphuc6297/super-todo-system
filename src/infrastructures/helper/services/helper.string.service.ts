import { Injectable } from '@nestjs/common'

@Injectable()
export class HelperStringService {
  randomString(
    length: number,
    characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  ): string {
    let result = ''
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  randomNumber(length: number): string {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  checkPasswordStrength(password: string): {
    score: number
    isStrong: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
    isLongEnough: boolean
  } {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const isLongEnough = password.length >= 8

    let score = 0
    if (hasUpperCase) score++
    if (hasLowerCase) score++
    if (hasNumber) score++
    if (hasSpecialChar) score++
    if (isLongEnough) score++

    return {
      score,
      isStrong: score >= 4,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    }
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, '')
  }

  toSnakeCase(str: string): string {
    return str
      .replace(/\s+/g, '_')
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
  }

  toKebabCase(str: string): string {
    return str
      .replace(/\s+/g, '-')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }
}
