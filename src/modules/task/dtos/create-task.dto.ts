import { TaskPriority, TaskStatus } from '../models/task.model'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { UserRole } from '@modules/user/models/user.model'

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the project',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    example: TaskStatus.TODO,
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
    description: 'Creator ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  creatorId?: string

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
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority

  @ApiProperty({
    description: 'Estimated time in minutes',
    example: 60,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  estimateTime: number

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