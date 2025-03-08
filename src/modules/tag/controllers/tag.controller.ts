import { JwtAuthGuard } from '@infras/authentication/guards/jwt.guard'
import { IDatabaseFindAllOptions } from '@infras/database/interfaces/database.interface'
import { PaginationDto } from '@infras/http/dtos/pagination.dto'
import { TaskTagModel } from '@modules/task/models/task-tag.model'
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateTagDto } from '../dtos/create-tag.dto'
import { UpdateTagDto } from '../dtos/update-tag.dto'
import { TagModel } from '../models/tag.model'
import { TagService } from '../services/tag.service'

@ApiTags('tags')
@Controller()
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 200,
    description: 'List of tags',
    type: [TagModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() paginationDto: PaginationDto): Promise<TagModel[]> {
    const options: IDatabaseFindAllOptions = {
      limit: paginationDto.perPage,
      skip: (paginationDto.page - 1) * paginationDto.perPage,
      order: {
        [paginationDto.sortBy]: paginationDto.sortOrder,
      },
    }
    return this.tagService.findAll(options)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag information',
    type: TagModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findById(@Param('id') id: string): Promise<TagModel> {
    return this.tagService.findById(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: 'Tag created successfully',
    type: TagModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTagDto: CreateTagDto): Promise<TagModel> {
    return this.tagService.create(createTagDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update tag information' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
    type: TagModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto): Promise<TagModel> {
    return this.tagService.update(id, updateTagDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete tag' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.tagService.delete(id)
  }

  // Tag-Task endpoints
  @Get(':tagId/tasks')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tasks for a tag' })
  @ApiParam({ name: 'tagId', description: 'Tag ID' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 200,
    description: 'List of tasks with this tag',
    type: [TaskTagModel],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findTagTasks(
    @Param('tagId') tagId: string,
    @Query() paginationDto: PaginationDto
  ): Promise<TaskTagModel[]> {
    const options: IDatabaseFindAllOptions = {
      limit: paginationDto.perPage,
      skip: (paginationDto.page - 1) * paginationDto.perPage,
      order: {
        [paginationDto.sortBy]: paginationDto.sortOrder,
      },
    }
    return this.tagService.findTagTasks(tagId, options)
  }
}
