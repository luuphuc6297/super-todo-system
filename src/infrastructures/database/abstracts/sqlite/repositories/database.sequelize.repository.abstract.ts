import { DATABASE_DELETED_AT_FIELD_NAME } from '@infras/database/constants/database.constant'
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseOptions,
  IDatabaseSequelizeOptions,
} from '@infras/database/interfaces/database.interface'
import { Model, ModelStatic, WhereOptions, FindOptions } from 'sequelize'
import { DatabaseBaseRepositoryAbstract } from '../../database.base-repository.abstract'

export abstract class DatabaseSequelizeRepositoryAbstract<
  Entity extends Model,
> extends DatabaseBaseRepositoryAbstract<Entity> {
  protected _repository: ModelStatic<Entity>
  protected _joinOnFind?: string | string[]

  constructor(repository: ModelStatic<Entity>, options?: string | string[]) {
    super()

    this._repository = repository
    this._joinOnFind = options
  }

  protected getJoinOptions(options?: IDatabaseFindAllOptions): string[] {
    if (options?.join) {
      if (this._joinOnFind) {
        if (Array.isArray(this._joinOnFind)) {
          return this._joinOnFind
        }
        return [this._joinOnFind]
      }
    }
    return []
  }

  protected getSequelizeOptions(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions
  ): IDatabaseSequelizeOptions {
    const sequelizeOptions: IDatabaseSequelizeOptions = {}
    const findOptions: FindOptions = {}

    if (options?.select) {
      findOptions.attributes = options.select
    }

    if (options?.order) {
      findOptions.order = Object.entries(options.order).map(([key, value]) => [key, value])
    }

    if (options?.limit) {
      findOptions.limit = options.limit
    }

    if (options?.skip) {
      findOptions.offset = options.skip
    }

    if (find) {
      findOptions.where = find as WhereOptions
    }

    // Handle join options
    if (options?.join && this._joinOnFind) {
      try {
        findOptions.include = this._joinOnFind;
      } catch (error) {
        console.error('Error setting up join options:', error);
      }
    }

    sequelizeOptions.findOptions = findOptions

    return sequelizeOptions
  }

  async findAll<T = Entity>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions
  ): Promise<T[]> {
    const { findOptions } = this.getSequelizeOptions(find, options)
    return this._repository.findAll(findOptions) as unknown as T[]
  }

  async findOne<T = Entity>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions
  ): Promise<T> {
    const { findOptions } = this.getSequelizeOptions(find, options)
    return this._repository.findOne(findOptions) as unknown as T
  }

  async findOneById<T = Entity>(id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.findOne({ id }, options)
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseOptions): Promise<number> {
    const { findOptions } = this.getSequelizeOptions(find, options)
    return this._repository.count(findOptions)
  }

  async create<Dto = any>(
    data: Dto,
    options?: IDatabaseCreateOptions
  ): Promise<Entity> {
    const entity = this._repository.build(data as any)
    if (options?.returnRaw) {
      return entity
    }
    return entity.save()
  }

  async save(repository: Entity): Promise<Entity> {
    return repository.save()
  }

  async delete(repository: Entity): Promise<Entity> {
    await repository.destroy()
    return repository
  }

  async softDelete(repository: Entity): Promise<Entity> {
    repository.set(DATABASE_DELETED_AT_FIELD_NAME as keyof Entity, new Date())
    return repository.save()
  }

  async restore(repository: Entity): Promise<Entity> {
    repository.set(DATABASE_DELETED_AT_FIELD_NAME as keyof Entity, null)
    return repository.save()
  }
}
