import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseOptions,
} from '../interfaces/database.interface'

export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract findAll<T = Entity>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>
  ): Promise<T[]>

  abstract findOne<T = Entity>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>
  ): Promise<T>

  abstract findOneById<T = Entity>(id: string, options?: IDatabaseFindOneOptions<any>): Promise<T>

  abstract getTotal(find?: Record<string, any>, options?: IDatabaseOptions<any>): Promise<number>

  abstract create<Dto = any>(data: Dto, options?: IDatabaseCreateOptions<any>): Promise<Entity>

  abstract save(repository: Entity): Promise<Entity>

  abstract delete(repository: Entity): Promise<Entity>

  abstract softDelete(repository: Entity): Promise<Entity>

  abstract restore(repository: Entity): Promise<Entity>
}
