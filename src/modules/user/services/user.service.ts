import { HelperHashService } from '@infras/helper/services/helper.hash.service'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UpdateUserDto } from '../dtos/update-user.dto'
import { UserModel, UserRole } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperHashService: HelperHashService
  ) {}

  /**
   * Get all users
   * @returns Promise containing an array of UserEntity objects
   */
  async findAll(): Promise<UserModel[]> {
    return this.userRepository.findAll()
  }

  /**
   * Find a user by ID
   * @param id - The UUID of the user to find
   * @returns Promise containing the UserEntity if found, null if not found
   */
  async findById(id: string): Promise<UserModel> {
    return this.userRepository.findOneById(id)
  }

  /**
   * Find a user by email address
   * @param email - The email address of the user to find
   * @returns Promise containing the UserEntity if found, null if not found
   */
  async findByEmail(email: string): Promise<UserModel> {
    return this.userRepository.findByEmail(email)
  }

  /**
   * Get all active users
   * @returns Promise containing an array of UserEntity objects with active status
   */
  async findActiveUsers(): Promise<UserModel[]> {
    return this.userRepository.findActiveUsers()
  }

  /**
   * Create a new user
   * @param createUserDto - Object containing user information to create
   * @returns Promise containing the created UserEntity
   * @remarks Password will be hashed before saving to the database
   */
  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await this.helperHashService.hash(createUserDto.password)

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    }

    return this.userRepository.createOne(userData)
  }

  /**
   * Update user information
   * @param id - The UUID of the user to update
   * @param updateUserDto - Object containing information to update
   * @returns Promise containing the updated UserEntity
   * @remarks If updating password, the new password will be hashed before saving
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel> {
    const userData = { ...updateUserDto }

    if (userData.password) {
      userData.password = await this.helperHashService.hash(userData.password)
    }

    return this.userRepository.updateOneById(id, userData)
  }

  /**
   * Delete a user
   * @param id - The UUID of the user to delete
   * @returns Promise containing a boolean indicating whether deletion was successful
   */
  async delete(id: string): Promise<boolean> {
    return this.userRepository.deleteOneById(id)
  }

  /**
   * Update user role
   * @param id - The UUID of the user to update
   * @param role - The new role to assign to the user
   * @returns Promise containing the updated UserEntity
   */
  async updateRole(id: string, role: UserRole): Promise<UserModel> {
    return this.userRepository.updateOneById(id, { role })
  }
}
