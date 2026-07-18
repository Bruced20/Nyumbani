export class AppError extends Error {
  constructor(
    public override message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message, 'DATABASE_ERROR', 500)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'You are not authorized to perform this action.') {
    super(message, 'UNAUTHORIZED', 403)
  }
}

export class DuplicateError extends AppError {
  constructor(message: string = 'This record already exists.') {
    super(message, 'DUPLICATE', 409)
  }
}

/** Postgres unique-violation SQLSTATE. */
export const PG_UNIQUE_VIOLATION = '23505'
