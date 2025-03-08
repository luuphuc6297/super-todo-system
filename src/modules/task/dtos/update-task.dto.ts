import { UserRole } from '@modules/user/models/user.model'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator'
import { TaskPriority, TaskStatus } from '../models/task.model'

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Write comprehensive documentation for the project',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus

  @ApiPropertyOptional({
    description: 'Task notes (only for paid users)',
    example: 'Remember to include diagrams and code examples',
  })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({
    description: 'Assignee ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority

  @ApiPropertyOptional({
    description: 'Estimated time in minutes',
    example: 60,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  estimateTime?: number

  @ApiPropertyOptional({
    description: 'Due date',
    example: '2023-12-31',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date

  @ApiPropertyOptional({
    description: 'User role for permission checking',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  userRole?: UserRole
}
