import { UserRole } from '@modules/user/models/user.model'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Model } from 'sequelize'

type TaskLike = {
  notes?: string
  [key: string]: unknown
}

type ResponseLike = {
  statusCode?: number
  message?: string
  data?: unknown
  [key: string]: unknown
}

@Injectable()
export class UserRoleFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>()
    const userRole = this.getUserRoleFromRequest(request)
    const method = request.method.toUpperCase()

    return next.handle().pipe(
      map((data) => {
        if (!data) return data

        // Don't modify the response for non-GET requests
        if (method !== 'GET') {
          return data
        }

        // Handle response object with data property
        if (data && typeof data === 'object' && 'data' in data) {
          const response = data as ResponseLike
          if (response.data) {
            // Process array data
            if (Array.isArray(response.data)) {
              response.data = response.data.map((item) => this.filterDataByUserRole(item, userRole))
            } else {
              // Process single object
              response.data = this.filterDataByUserRole(response.data, userRole)
            }
          }
          return response
        }

        // Don't wrap the response if it's already a Sequelize model or instance
        if (
          data &&
          typeof data === 'object' &&
          (data.constructor?.name === 'SequelizeModel' ||
            data.constructor?.name === 'Model' ||
            data instanceof Model)
        ) {
          return this.filterDataByUserRole(data, userRole)
        }

        // Process array data
        if (Array.isArray(data)) {
          return data.map((item) => this.filterDataByUserRole(item, userRole))
        }

        // Process single object
        return this.filterDataByUserRole(data, userRole)
      })
    )
  }

  private getUserRoleFromRequest(request: Request): UserRole {
    // Priority 1: get from URL query parameter
    const roleFromQuery = request.query.userRole as string
    if (roleFromQuery) {
      // Convert to lowercase for case-insensitive comparison
      const normalizedRole = roleFromQuery.toLowerCase()

      if (normalizedRole === 'free') {
        return UserRole.FREE
      } else if (normalizedRole === 'paid') {
        return UserRole.PAID
      } else if (Object.values(UserRole).includes(roleFromQuery as UserRole)) {
        // If it's already a valid UserRole enum value, use it directly
        return roleFromQuery as UserRole
      }
    }

    // Priority 2: get from authenticated user
    const user = request.user as { role?: UserRole } | undefined
    if (user?.role) {
      return user.role
    }

    // Default is FREE if role cannot be determined
    return UserRole.FREE
  }

  /**
   * Filter data based on user role
   * @param data - The data to filter
   * @param userRole - The user role to filter by
   * @returns The filtered data
   */
  private filterDataByUserRole(data: any, userRole: UserRole): any {
    // If data is null or undefined, return as is
    if (data === null || data === undefined) {
      return data
    }

    // If data is an array, filter each item
    if (Array.isArray(data)) {
      return data.map((item) => this.filterDataByUserRole(item, userRole))
    }

    // If data is a Sequelize model instance, convert to JSON and filter
    if (data && typeof data === 'object' && typeof data.toJSON === 'function') {
      return this.filterDataByUserRole(data.toJSON(), userRole)
    }

    // If not an object, return as is
    if (!data || typeof data !== 'object') {
      return data
    }

    // If data is a task, filter based on user role
    if (data.title && (data.status !== undefined || data.notes !== undefined)) {
      return this.filterTaskByUserRole(data, userRole)
    }

    // For other objects, recursively filter nested properties
    const filteredData = { ...data }
    for (const key in filteredData) {
      if (Object.prototype.hasOwnProperty.call(filteredData, key)) {
        filteredData[key] = this.filterDataByUserRole(filteredData[key], userRole)
      }
    }

    return filteredData
  }

  private filterTaskByUserRole(task: TaskLike, userRole: UserRole): TaskLike {
    // Clone object to avoid modifying original data
    const filteredTask = { ...task }

    // If not a paid user or admin, remove notes field
    if (userRole !== UserRole.PAID && userRole !== UserRole.ADMIN) {
      delete filteredTask.notes
    }

    return filteredTask
  }
}
