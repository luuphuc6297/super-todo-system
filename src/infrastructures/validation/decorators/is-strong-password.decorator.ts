import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false

          // Check minimum length
          if (value.length < 8) return false

          // Check for at least one uppercase letter
          if (!/[A-Z]/.test(value)) return false

          // Check for at least one lowercase letter
          if (!/[a-z]/.test(value)) return false

          // Check for at least one number
          if (!/[0-9]/.test(value)) return false

          // Check for at least one special character
          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false

          return true
        },
        defaultMessage() {
          return 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        },
      },
    })
  }
} 