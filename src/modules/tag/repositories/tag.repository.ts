import { DatabaseSequelizeRepositoryAbstract } from '@infras/database/abstracts/sqlite/repositories/database.sequelize.repository.abstract'
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from '@infras/database/interfaces/database.interface'
import { TaskTagModel } from '@modules/task/models/task-tag.model'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FindOptions } from 'sequelize'
import { TagModel } from '../models/tag.model'

@Injectable()
export class TagRepository extends DatabaseSequelizeRepositoryAbstract<TagModel> {
  constructor(
    @InjectModel(TagModel)
    private readonly tagModel: typeof TagModel,
    @InjectModel(TaskTagModel)
    private readonly taskTagModel: typeof TaskTagModel
  ) {
    super(tagModel)
  }

  async findAll<T = TagModel>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions
  ): Promise<T[]> {
    return super.findAll(find, options)
  }

  async findOneById<T = TagModel>(id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return super.findOneById(id, options)
  }

  async findByName(name: string, options?: IDatabaseFindAllOptions): Promise<TagModel | null> {
    return this.findOne({ name }, options)
  }

  async createOne(data: Partial<TagModel>): Promise<TagModel> {
    return this.create(data)
  }

  async updateOneById(id: string, data: Partial<TagModel>): Promise<TagModel> {
    const tag = await this.findOneById(id)
    if (!tag) {
      throw new Error('Tag not found')
    }
    Object.assign(tag, data)
    return this.save(tag)
  }

  async deleteOneById(id: string): Promise<boolean> {
    const tag = await this.findOneById(id)
    if (!tag) {
      return false
    }
    await this.delete(tag)
    return true
  }

  async findTagTasks(tagId: string, options?: IDatabaseFindAllOptions): Promise<TaskTagModel[]> {
    const findOptions: FindOptions = {
      where: { tagId },
    }

    if (options?.limit) findOptions.limit = options.limit
    if (options?.skip) findOptions.offset = options.skip
    if (options?.order) {
      findOptions.order = Object.entries(options.order).map(([key, value]) => [key, value])
    }

    return this.taskTagModel.findAll(findOptions)
  }
}
