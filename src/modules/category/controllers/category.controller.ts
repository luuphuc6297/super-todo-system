import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryService } from '../services/category.service'
import { CategoryModel } from '../models/category.model'
import { CreateCategoryDto } from '../dtos/create-category.dto'
import { UpdateCategoryDto } from '../dtos/update-category.dto'

@ApiTags('categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories', type: [CategoryModel] })
  async findAll(): Promise<CategoryModel[]> {
    return this.categoryService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Return category by id', type: CategoryModel })
  async findOne(@Param('id') id: string): Promise<CategoryModel> {
    return this.categoryService.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryModel })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryModel> {
    return this.categoryService.create(createCategoryDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryModel })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryModel> {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.categoryService.delete(id)
  }
} 