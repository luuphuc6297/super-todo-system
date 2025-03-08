import { Injectable } from '@nestjs/common'
import { CreateTagDto } from '../dtos/create-tag.dto'
import { UpdateTagDto } from '../dtos/update-tag.dto'
import { TagModel } from '../models/tag.model'
import { TagRepository } from '../repositories/tag.repository'
import { IDatabaseFindAllOptions } from '@infras/database/interfaces/database.interface'
import { TaskTagModel } from '@modules/task/models/task-tag.model'

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * Get all tags with optional pagination and sorting
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise with array of tags
   */
  async findAll(options?: IDatabaseFindAllOptions): Promise<TagModel[]> {
    return this.tagRepository.findAll(options)
  }

  /**
   * Get tag by id
   * @param id - Tag id
   * @returns Promise with tag
   * @throws Error if tag not found
   */
  async findById(id: string): Promise<TagModel> {
    const tag = await this.tagRepository.findOneById(id)
    if (!tag) {
      throw new Error('Tag not found')
    }
    return tag
  }

  /**
   * Get tag by name
   * @param name - Tag name
   * @returns Promise with tag or null if not found
   */
  async findByName(name: string): Promise<TagModel | null> {
    return this.tagRepository.findByName(name)
  }

  /**
   * Create new tag
   * @param createTagDto - Data for creating tag
   * @returns Promise with created tag
   */
  async create(createTagDto: CreateTagDto): Promise<TagModel> {
    const existingTag = await this.findByName(createTagDto.name)
    if (existingTag) {
      throw new Error('Tag with this name already exists')
    }
    return this.tagRepository.createOne(createTagDto)
  }

  /**
   * Update tag by id
   * @param id - Tag id
   * @param updateTagDto - Data for updating tag
   * @returns Promise with updated tag
   * @throws Error if tag not found
   */
  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagModel> {
    return this.tagRepository.updateOneById(id, updateTagDto)
  }

  /**
   * Delete tag by id
   * @param id - Tag id
   * @returns Promise with boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    return this.tagRepository.deleteOneById(id)
  }

  /**
   * Find all tasks with specific tag
   * @param tagId - Tag id
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise with array of task-tag relations
   */
  async findTagTasks(tagId: string, options?: IDatabaseFindAllOptions): Promise<TaskTagModel[]> {
    return this.tagRepository.findTagTasks(tagId, options)
  }
}
