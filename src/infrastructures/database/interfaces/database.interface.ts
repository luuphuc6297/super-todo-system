import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm'
import { FindOptions, WhereOptions } from 'sequelize'

export interface IDatabaseOptions<T = any> {
  session?: T
}

export interface IDatabaseFindOneOptions<T = any> extends IDatabaseOptions<T> {
  join?: boolean | string | string[]
  select?: string[]
}

export interface IDatabaseFindAllOptions<T = any> extends IDatabaseOptions<T> {
  join?: boolean | string | string[]
  select?: string[]
  limit?: number
  skip?: number
  order?: Record<string, 'ASC' | 'DESC'>
}

export interface IDatabaseCreateOptions<T = any> extends IDatabaseOptions<T> {
  transaction?: boolean
  returnRaw?: boolean
}

export interface IDatabaseExistOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseCreateManyOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseManyOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseSoftDeleteManyOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseRestoreManyOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseRawOptions extends IDatabaseOptions {}

export interface IDatabaseGetTotalOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseSaveOptions<T = any> extends IDatabaseOptions<T> {}

export interface IDatabaseFindAllResult<T> {
  data: T[]
  total: number
  limit?: number
  skip?: number
}

export interface IDatabaseFindOneResult<T> {
  data: T
}

export interface IDatabaseCreateResult<T> {
  data: T
}

export interface IDatabaseCreateManyResult {
  success: boolean
}

export interface IDatabaseUpdateResult<T> {
  data: T
}

export interface IDatabaseDeleteResult {
  success: boolean
}

export interface IDatabaseSoftDeleteResult {
  success: boolean
}

export interface IDatabaseRestoreResult {
  success: boolean
}

export interface IDatabaseRawResult<T> {
  data: T[]
}

export interface IDatabaseExistResult {
  exists: boolean
}

export interface IDatabaseGetTotalResult {
  total: number
}

export interface IDatabaseSaveResult<T> {
  data: T
}

export interface IDatabaseTypeORMOptions {
  findOne?: FindOneOptions
  findMany?: FindManyOptions
  where?: FindOptionsWhere<any> | FindOptionsWhere<any>[]
}

export interface IDatabaseSequelizeOptions {
  findOptions?: FindOptions
  where?: WhereOptions
}
