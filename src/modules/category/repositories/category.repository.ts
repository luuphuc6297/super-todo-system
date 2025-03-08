import { DatabaseSequelizeRepositoryAbstract } from '@infras/database/abstracts/sqlite/repositories/database.sequelize.repository.abstract'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoryModel } from '../models/category.model'

@Injectable()
export class CategoryRepository extends DatabaseSequelizeRepositoryAbstract<CategoryModel> {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: typeof CategoryModel
  ) {
    super(categoryModel)
  }

  async createOne(data: Partial<CategoryModel>): Promise<CategoryModel> {
    return this.create(data)
  }

  async updateOneById(id: string, data: Partial<CategoryModel>): Promise<CategoryModel> {
    const category = await this.findOneById(id)
    if (!category) {
      throw new Error('Category not found')
    }
    Object.assign(category, data)
    return this.save(category)
  }

  async deleteOneById(id: string): Promise<boolean> {
    const category = await this.findOneById(id)
    if (!category) {
      return false
    }
    await this.delete(category)
    return true
  }
}
