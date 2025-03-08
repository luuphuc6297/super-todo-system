import { Injectable } from '@nestjs/common'

export interface IResponseOptions {
  statusCode?: number
  message?: string
  metadata?: Record<string, any>
}

export interface IResponsePaging {
  totalData: number
  totalPage: number
  currentPage: number
  perPage: number
}

@Injectable()
export class ResponseService {
  success<T>(
    data: T,
    options?: IResponseOptions
  ): {
    statusCode: number
    message: string
    data: T
    metadata?: Record<string, any>
  } {
    return {
      statusCode: options?.statusCode || 200,
      message: options?.message || 'Success',
      data,
      ...(options?.metadata && { metadata: options.metadata }),
    }
  }

  successWithPaging<T>(
    data: T[],
    paging: IResponsePaging,
    options?: IResponseOptions
  ): {
    statusCode: number
    message: string
    data: T[]
    paging: IResponsePaging
    metadata?: Record<string, any>
  } {
    return {
      statusCode: options?.statusCode || 200,
      message: options?.message || 'Success',
      data,
      paging,
      ...(options?.metadata && { metadata: options.metadata }),
    }
  }

  error(options?: IResponseOptions): {
    statusCode: number
    message: string
    metadata?: Record<string, any>
  } {
    return {
      statusCode: options?.statusCode || 500,
      message: options?.message || 'Internal Server Error',
      ...(options?.metadata && { metadata: options.metadata }),
    }
  }
}
