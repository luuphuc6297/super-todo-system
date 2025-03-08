import { Injectable } from '@nestjs/common'
import { CategoryModel } from '../models/category.model'
import { CategoryRepository } from '../repositories/category.repository'
import { CreateCategoryDto } from '../dtos/create-category.dto'
import { UpdateCategoryDto } from '../dtos/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Get all categories
   * @returns Promise containing an array of CategoryModel objects
   */
  async findAll(): Promise<CategoryModel[]> {
    return this.categoryRepository.findAll()
  }

  /**
   * Find a category by ID
   * @param id - The UUID of the category to find
   * @returns Promise containing the CategoryModel if found, null if not found
   */
  async findById(id: string): Promise<CategoryModel> {
    return this.categoryRepository.findOneById(id)
  }

  /**
   * Create a new category
   * @param createCategoryDto - Object containing category information to create
   * @returns Promise containing the created CategoryModel
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryModel> {
    return this.categoryRepository.createOne(createCategoryDto)
  }

  /**
   * Update category information
   * @param id - The UUID of the category to update
   * @param updateCategoryDto - Object containing information to update
   * @returns Promise containing the updated CategoryModel
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryModel> {
    return this.categoryRepository.updateOneById(id, updateCategoryDto)
  }

  /**
   * Delete a category
   * @param id - The UUID of the category to delete
   * @returns Promise containing a boolean indicating whether deletion was successful
   */
  async delete(id: string): Promise<boolean> {
    return this.categoryRepository.deleteOneById(id)
  }
} 