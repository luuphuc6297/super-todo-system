import { UserRepository } from '@modules/user/repositories/user.repository'
import { Injectable } from '@nestjs/common'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

@Injectable()
export class IsEmailUniqueConstraint {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string) {
    const user = await this.userRepository.findByEmail(email)
    return !user // Return true if email doesn't exist
  }

  defaultMessage(args: ValidationArguments) {
    return `Email '${args.value}' is already in use`
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: IsEmailUniqueConstraint,
    })
  }
}
