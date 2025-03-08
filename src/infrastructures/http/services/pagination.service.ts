import { Injectable } from '@nestjs/common'

export interface PaginationOptions {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  filter?: Record<string, any>
}

export interface PaginationResult<T> {
  data: T[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

@Injectable()
export class PaginationService {
  private readonly DEFAULT_PAGE = 1
  private readonly DEFAULT_PER_PAGE = 10
  private readonly MAX_PER_PAGE = 100

  buildPaginationOptions(options?: PaginationOptions): PaginationOptions {
    const page = options?.page && options.page > 0 ? options.page : this.DEFAULT_PAGE
    const perPage =
      options?.perPage && options.perPage > 0 && options.perPage <= this.MAX_PER_PAGE
        ? options.perPage
        : this.DEFAULT_PER_PAGE

    return {
      page,
      perPage,
      sortBy: options?.sortBy || 'createdAt',
      sortOrder: options?.sortOrder || 'DESC',
      filter: options?.filter || {},
    }
  }

  createPaginationResult<T>(
    data: T[],
    total: number,
    options: PaginationOptions
  ): PaginationResult<T> {
    const { page, perPage } = options
    const totalPages = Math.ceil(total / perPage)

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages,
      },
    }
  }

  getSkip(options: PaginationOptions): number {
    return (options.page - 1) * options.perPage
  }

  getFilterEqual(field: string, value: any): Record<string, any> {
    return { [field]: value }
  }

  getFilterContain(field: string, value: string): Record<string, any> {
    return { [field]: { $like: `%${value}%` } }
  }
}
