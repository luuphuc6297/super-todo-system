export interface IErrorHttpFilterMetadata {
  statusCode: number
  message: string
  errors?: Record<string, any>[]
  timestamp: number
  path: string
}

export interface IErrorHttpFilter {
  statusCode: number
  message: string
  errors?: Record<string, any>[]
  timestamp: number
  path: string
}

export interface IErrorException {
  statusCode: number
  message: string
  errors?: Record<string, any>[]
}

export interface IErrors {
  readonly message: string
  readonly property: string
}
