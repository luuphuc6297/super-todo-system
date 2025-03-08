import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { TaskModel, TaskPriority, TaskStatus } from '../models/task.model'
import { UserRole } from '@modules/user/models/user.model'

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  title: string

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Write comprehensive documentation for the project',
  })
  description: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  priority: TaskPriority

  @ApiProperty({
    description: 'Estimated time in minutes',
    example: 60,
  })
  estimateTime: number

  @ApiPropertyOptional({
    description: 'Due date',
    example: '2023-12-31',
  })
  dueDate: Date

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-02T00:00:00.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Creator ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  creatorId: string

  @ApiPropertyOptional({
    description: 'Assignee ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assigneeId: string

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string

  @ApiPropertyOptional({
    description: 'Task notes (only for paid users)',
    example: 'Remember to include diagrams and code examples',
  })
  @Exclude()
  notes: string

  constructor(task: Partial<TaskModel>, userRole?: UserRole) {
    Object.assign(this, task)

    // Show notes only for paid users or admins
    if (userRole === UserRole.PAID || userRole === UserRole.ADMIN) {
      this.showNotes()
    }
  }

  @Expose()
  showNotes() {
    return this.notes
  }

  static createFromEntity(task: TaskModel, userRole: UserRole): TaskResponseDto {
    return new TaskResponseDto(task, userRole)
  }

  static createFromEntities(tasks: TaskModel[], userRole: UserRole): TaskResponseDto[] {
    return tasks.map((task) => TaskResponseDto.createFromEntity(task, userRole))
  }
}
