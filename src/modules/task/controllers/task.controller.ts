import { IDatabaseFindAllOptions } from '@infras/database/interfaces/database.interface'
import { PaginationDto } from '@infras/http/dtos/pagination.dto'
import { UserRole } from '@modules/user/models/user.model'
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpCode } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Auth } from '@infras/authentication/decorators/auth.decorator'
import { JwtAuthGuard } from '@infras/authentication/guards/jwt.guard'
import { RoleGuard } from '@infras/authentication/guards/role.guard'
import { CreateTaskDto } from '../dtos/create-task.dto'
import { CreateTaskTagDto } from '../dtos/create-task-tag.dto'
import { UpdateTaskDto } from '../dtos/update-task.dto'
import { TaskService } from '../services/task.service'
import { CurrentUser } from '@infras/authentication/decorators/current-user.decorator'
import { TaskResponseDto } from '../dtos/task-response.dto'
import { TaskTagModel } from '../models/task-tag.model'
import { TaskModel, TaskStatus } from '../models/task.model'
import { UserModel } from '@modules/user/models/user.model'

@ApiTags('tasks')
@Controller()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Auth(UserRole.FREE, UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: [TaskModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async findAll(@Query() paginationDto: PaginationDto): Promise<TaskModel[]> {
    const options: IDatabaseFindAllOptions = {
      limit: paginationDto.perPage,
      skip: (paginationDto.page - 1) * paginationDto.perPage,
      join: true,
    }
    return this.taskService.findAll(options)
  }

  @Get(':id')
  @Auth(UserRole.FREE, UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({
    status: 200,
    description: 'Task information',
    type: TaskModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async findById(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.findById(id)
  }

  @Post()
  @Auth(UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only paid users and admins can create tasks' })
  @ApiBody({ type: CreateTaskDto })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserModel
  ): Promise<TaskModel> {
    createTaskDto.creatorId = user.id;
    createTaskDto.userRole = user.role;
    return this.taskService.create(createTaskDto)
  }

  @Put(':id')
  @Auth(UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserModel
  ): Promise<TaskModel> {
    updateTaskDto.userRole = user.role;
    return this.taskService.update(id, updateTaskDto)
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  async delete(@Param('id') id: string): Promise<{}> {
    await this.taskService.delete(id)
    return {}
  }

  @Get(':taskId/tags')
  @Auth(UserRole.FREE, UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all tags for a task' })
  @ApiResponse({
    status: 200,
    description: 'List of task tags',
    type: [TaskTagModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async findTaskTags(
    @Param('taskId') taskId: string,
    @Query() paginationDto: PaginationDto
  ): Promise<TaskTagModel[]> {
    const options: IDatabaseFindAllOptions = {
      limit: paginationDto.perPage,
      skip: (paginationDto.page - 1) * paginationDto.perPage,
    }
    return this.taskService.findTaskTags(taskId, options)
  }

  @Post(':taskId/tags')
  @Auth(UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add tag to task' })
  @ApiResponse({
    status: 201,
    description: 'Tag added to task successfully',
    type: TaskTagModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task or tag not found' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiBody({ type: CreateTaskTagDto })
  async addTagToTask(
    @Param('taskId') taskId: string,
    @Body() createTaskTagDto: CreateTaskTagDto
  ): Promise<TaskTagModel> {
    return this.taskService.addTagToTask(taskId, createTaskTagDto.tagId, createTaskTagDto.userRole)
  }

  @Delete(':taskId/tags/:tagId')
  @Auth(UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove tag from task' })
  @ApiResponse({
    status: 200,
    description: 'Tag removed from task successfully',
    type: Boolean,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task or tag not found' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiParam({ name: 'tagId', description: 'Tag ID' })
  async removeTagFromTask(
    @Param('taskId') taskId: string,
    @Param('tagId') tagId: string
  ): Promise<boolean> {
    return this.taskService.removeTagFromTask(taskId, tagId, UserRole.FREE)
  }

  @Get('status/:status')
  @Auth(UserRole.FREE, UserRole.PAID, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get tasks by status' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks with specified status',
    type: [TaskResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'status', enum: TaskStatus, description: 'Task status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async findByStatus(
    @Param('status') status: TaskStatus,
    @Query() paginationDto: PaginationDto
  ): Promise<TaskModel[]> {
    const options: IDatabaseFindAllOptions = {
      limit: paginationDto.perPage,
      skip: (paginationDto.page - 1) * paginationDto.perPage,
      join: true,
    }
    return this.taskService.findByStatus(status, options)
  }
}
