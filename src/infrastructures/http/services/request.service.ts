import { Injectable, Scope } from '@nestjs/common'
import { Request } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private request: Request

  /**
   * Sets the Express request object for the current context
   * @param request - The Express request object
   */
  setRequest(request: Request): void {
    this.request = request
  }

  /**
   * Gets the Express request object for the current context
   * @returns The Express request object
   */
  getRequest(): Request {
    return this.request
  }

  /**
   * Gets the client IP address from the request
   * @returns The client IP address as a string
   * @remarks Checks x-forwarded-for header first, then connection.remoteAddress, then socket.remoteAddress
   */
  getIp(): string {
    const ip =
      this.request.headers['x-forwarded-for'] ||
      this.request.connection.remoteAddress ||
      this.request.socket.remoteAddress

    return Array.isArray(ip) ? ip[0] : (ip as string)
  }

  /**
   * Gets the user agent string from the request headers
   * @returns The user agent string
   */
  getUserAgent(): string {
    return this.request.headers['user-agent'] as string
  }

  /**
   * Gets all headers from the request
   * @returns Object containing all request headers
   */
  getHeaders(): Record<string, any> {
    return this.request.headers
  }

  /**
   * Gets a specific header value from the request
   * @param key - The header key to retrieve
   * @returns The header value as a string
   */
  getHeader(key: string): string {
    return this.request.headers[key] as string
  }

  /**
   * Gets the request body
   * @returns Object containing the request body data
   */
  getBody(): Record<string, any> {
    return this.request.body
  }

  /**
   * Gets the query parameters from the request
   * @returns Object containing all query parameters
   */
  getQuery(): Record<string, any> {
    return this.request.query
  }

  /**
   * Gets the route parameters from the request
   * @returns Object containing all route parameters
   */
  getParams(): Record<string, any> {
    return this.request.params
  }
}
