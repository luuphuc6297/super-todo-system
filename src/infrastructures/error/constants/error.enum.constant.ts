export enum ENUM_ERROR_STATUS_CODE_ERROR {
  UNKNOWN = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum ENUM_ERROR_MESSAGE {
  UNKNOWN = 'error.unknown',
  BAD_REQUEST = 'error.badRequest',
  UNAUTHORIZED = 'error.unauthorized',
  FORBIDDEN = 'error.forbidden',
  NOT_FOUND = 'error.notFound',
  CONFLICT = 'error.conflict',
  UNPROCESSABLE_ENTITY = 'error.unprocessableEntity',
  SERVICE_UNAVAILABLE = 'error.serviceUnavailable',
  GATEWAY_TIMEOUT = 'error.gatewayTimeout',
}
