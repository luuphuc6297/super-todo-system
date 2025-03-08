import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from '../dtos/create-task.dto'
import { UpdateTaskDto } from '../dtos/update-task.dto'
import { TaskModel, TaskStatus } from '../models/task.model'
import { TaskRepository } from '../repositories/task.repository'
import { IDatabaseFindAllOptions } from '@infras/database/interfaces/database.interface'
import { UserRole } from '@modules/user/models/user.model'
import { TaskTagModel } from '../models/task-tag.model'

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository
  ) {}

  /**
   * Find all tasks with optional pagination and sorting
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskEntity objects
   */
  async findAll(options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.taskRepository.findAll(undefined, options)
  }

  /**
   * Find a task by its ID
   * @param id - The UUID of the task to find
   * @returns Promise containing the found TaskEntity
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async findById(id: string): Promise<TaskModel> {
    const task = await this.taskRepository.findOneById(id)
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return task
  }

  /**
   * Find all tasks created by a specific user
   * @param creatorId - The UUID of the creator user
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskEntity objects
   */
  async findByCreatorId(creatorId: string, options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.taskRepository.findAll({ creatorId }, options)
  }

  /**
   * Find all tasks assigned to a specific user
   * @param assigneeId - The UUID of the assignee user
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskEntity objects
   */
  async findByAssigneeId(assigneeId: string, options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.taskRepository.findAll({ assigneeId }, options)
  }

  /**
   * Find all tasks belonging to a specific category
   * @param categoryId - The UUID of the category
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskEntity objects
   */
  async findByCategoryId(categoryId: string, options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.taskRepository.findAll({ categoryId }, options)
  }

  /**
   * Find all tasks with a specific status
   * @param status - The task status to filter by (TODO, IN_PROGRESS, DONE, etc.)
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskEntity objects
   */
  async findByStatus(status: TaskStatus, options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.taskRepository.findAll({ status }, options)
  }

  /**
   * Create a new task
   * @param createTaskDto - Data transfer object containing task properties
   * @returns Promise containing the created TaskEntity
   * @remarks Notes will be removed for free users
   */
  async create(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    if (createTaskDto.userRole === UserRole.FREE && createTaskDto.notes) {
      delete createTaskDto.notes
    }
    
    return this.taskRepository.createOne(createTaskDto)
  }

  /**
   * Update an existing task
   * @param id - The UUID of the task to update
   * @param updateTaskDto - Data transfer object containing task properties to update
   * @returns Promise containing the updated TaskEntity
   * @throws NotFoundException if task with given ID doesn't exist
   * @throws ForbiddenException if a free user tries to update notes
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskModel> {
    // Verify task exists
    await this.findById(id)
    
    // Check user role from token (higher priority)
    if (updateTaskDto.notes !== undefined && updateTaskDto.userRole === UserRole.FREE) {
      throw new ForbiddenException('Only paid users can update task notes')
    }
    
    return this.taskRepository.updateOneById(id, updateTaskDto)
  }

  /**
   * Delete a task
   * @param id - The UUID of the task to delete
   * @returns Promise containing a boolean indicating success
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async delete(id: string): Promise<boolean> {
    await this.findById(id)
    
    return this.taskRepository.deleteOneById(id)
  }

  /**
   * Find all tags associated with a specific task
   * @param taskId - The UUID of the task
   * @param options - Database find options for pagination, sorting, and filtering
   * @returns Promise containing an array of TaskTagEntity objects
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async findTaskTags(taskId: string, options?: IDatabaseFindAllOptions): Promise<TaskTagModel[]> {
    await this.findById(taskId)
    
    return this.taskRepository.findTaskTags(taskId, options)
  }

  /**
   * Add a tag to a task
   * @param taskId - The UUID of the task
   * @param tagId - The UUID of the tag to add
   * @param userRole - The role of the user performing the action
   * @returns Promise containing the created TaskTagEntity
   * @throws ForbiddenException if user doesn't have required permissions
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async addTagToTask(taskId: string, tagId: string, userRole: UserRole): Promise<TaskTagModel> {
    if (userRole !== UserRole.PAID && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only paid users and admins can add tags to tasks')
    }
    
    await this.findById(taskId)
    
    return this.taskRepository.addTagToTask(taskId, tagId)
  }

  /**
   * Remove a tag from a task
   * @param taskId - The UUID of the task
   * @param tagId - The UUID of the tag to remove
   * @param userRole - The role of the user performing the action
   * @returns Promise containing a boolean indicating success
   * @throws ForbiddenException if user doesn't have required permissions
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async removeTagFromTask(taskId: string, tagId: string, userRole: UserRole): Promise<boolean> {
    if (userRole !== UserRole.PAID && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only paid users and admins can remove tags from tasks')
    }
    
    await this.findById(taskId)
    
    return this.taskRepository.removeTagFromTask(taskId, tagId)
  }

  /**
   * Remove all tags from a task
   * @param taskId - The UUID of the task
   * @param userRole - The role of the user performing the action
   * @returns Promise containing a boolean indicating success
   * @throws ForbiddenException if user doesn't have required permissions
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async removeAllTagsFromTask(taskId: string, userRole: UserRole): Promise<boolean> {
    if (userRole !== UserRole.PAID && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only paid users and admins can remove tags from tasks')
    }
    
    await this.findById(taskId)
    
    return this.taskRepository.removeAllTagsFromTask(taskId)
  }

  /**
   * Update the notes of a task
   * @param id - The UUID of the task
   * @param notes - The new notes content
   * @param userRole - The role of the user performing the action
   * @returns Promise containing the updated TaskEntity
   * @throws ForbiddenException if user doesn't have required permissions
   * @throws NotFoundException if task with given ID doesn't exist
   */
  async updateNotes(id: string, notes: string, userRole: UserRole): Promise<TaskModel> {
    if (userRole !== UserRole.PAID && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only paid users and admins can update task notes')
    }
    
    await this.findById(id)
    
    return this.taskRepository.updateOneById(id, { notes })
  }
} 