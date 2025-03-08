import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from '@infras/database/interfaces/database.interface'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserModel, UserStatus } from '../models/user.model'
import { DatabaseSequelizeRepositoryAbstract } from '@infras/database/abstracts/sqlite/repositories/database.sequelize.repository.abstract'

@Injectable()
export class UserRepository extends DatabaseSequelizeRepositoryAbstract<UserModel> {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel
  ) {
    super(userModel)
  }

  async findByEmail(email: string, options?: IDatabaseFindOneOptions): Promise<UserModel | null> {
    return this.findOne({ email }, options)
  }

  async findActiveUsers(options?: IDatabaseFindAllOptions): Promise<UserModel[]> {
    return this.findAll({ status: UserStatus.ACTIVE }, options)
  }

  async createOne(data: Partial<UserModel>): Promise<UserModel> {
    return this.create(data)
  }

  async updateOneById(id: string, data: Partial<UserModel>): Promise<UserModel> {
    const user = await this.findOneById(id)
    if (!user) {
      throw new Error('User not found')
    }
    Object.assign(user, data)
    return this.save(user)
  }

  async deleteOneById(id: string): Promise<boolean> {
    const user = await this.findOneById(id)
    if (!user) {
      return false
    }
    await this.delete(user)
    return true
  }
}
