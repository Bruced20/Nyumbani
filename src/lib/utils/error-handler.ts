import { ZodError } from 'zod'
import { logger } from './logger'

export interface AppErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export class AppError extends Error {
  public code: string
  public status: number
  public details?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    status: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Standardized Error Handling Utility.
 * Parses exceptions into clean UI-facing messages and logs details to console/logs.
 */
export function handleValidationError(error: unknown): AppErrorResponse {
  if (error instanceof ZodError) {
    logger.warn('Validation error encountered', { errors: error.issues })
    return {
      success: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Invalid request data provided.',
        details: error.flatten().fieldErrors as unknown as Record<string, unknown>,
      },
    }
  }

  if (error instanceof AppError) {
    logger.error(`App error [${error.code}]: ${error.message}`, error.details)
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }
  }

  const message = error instanceof Error ? error.message : 'An unknown error occurred.'
  logger.error('Unhandled system exception:', { message, raw: error as Record<string, unknown> })

  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'A server exception occurred. Please try again later.',
    },
  }
}
