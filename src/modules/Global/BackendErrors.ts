export enum GeneralErrors {
  METHOD_NOT_IMPLEMENTED = "METHOD_NOT_IMPLEMENTED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNHANDLED_ERROR = "UNHANDLED_ERROR",
  USER_TOKEN_IS_MISSING = "USER_TOKEN_IS_MISSING",
  OBJECT_NOT_FOUND_IN_DATABASE = "OBJECT_NOT_FOUND_IN_DATABASE",
  INVALID_REQUEST = "INVALID_REQUEST",
  PACKET_NOT_AUTHENTIC = "PACKET_NOT_AUTHENTIC",
  DATABASE_REQUEST_ERROR = "DATABASE_REQUEST_ERROR"
}

export enum UserErrors {
  ERROR_WHILE_SEARCHING_USER_IN_DATABASE = "ERROR_WHILE_SEARCHING_USER_IN_DATABASE",
  ERROR_WHILE_COMPARE_PASSWORD = "ERROR_WHILE_COMPARE_PASSWORD",
  ERROR_WHILE_UPDATING_DELEGATIONS = "ERROR_WHILE_UPDATING_DELEGATIONS"
}

export enum AuthenticationErrors {
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_MUST_BE_LOGGED_OFF = "AUTH_MUST_BE_LOGGED_OFF",
  AUTH_MUST_BE_LOGGED_ON = "AUTH_MUST_BE_LOGGED_ON",
  AUTH_NO_TOKEN_PROVIDED = "AUTH_NO_TOKEN_PROVIDED",
  AUTH_TOKEN_IS_NOT_AUTHENTIC = "AUTH_TOKEN_IS_NOT_AUTHENTIC",
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_NO_ROLE_ALLOWED = "AUTH_NO_ROLE_ALLOWED",
  AUTH_USER_CLIENT_CONVERSION_FAILED = "AUTH_USER_CLIENT_CONVERSION_FAILED",
  AUTH_ACCESS_TO_INTRANET_NOT_ALLOWED = "AUTH_ACCESS_TO_INTRANET_NOT_ALLOWED",
  AUTH_DISABLED_ACCOUNT = "AUTH_DISABLED_ACCOUNT",
  ACCESS_NOT_AUTHORIZED = "ACCESS_NOT_AUTHORIZED"
}
