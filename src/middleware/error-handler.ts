import type { Request, Response, NextFunction } from 'express'

export interface AppError {
  code: string
  message: string
  details?: unknown
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err)

  if (isAppError(err)) {
    const statusCode = getStatusCode(err.code)
    const errorResponse: Record<string, unknown> = {
      code: err.code,
      message: err.message,
    }
    if (err.details) {
      errorResponse.details = err.details
    }
    res.status(statusCode).json({
      success: false,
      error: errorResponse,
    })
    return
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  })
}

const isAppError = (err: unknown): err is AppError => {
  return typeof err === 'object' && err !== null && 'code' in err && 'message' in err
}

const getStatusCode = (code: string): number => {
  const statusMap: Record<string, number> = {
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
  }
  return statusMap[code] || 500
}

export const createError = (code: string, message: string, details?: unknown): AppError => ({
  code,
  message,
  details,
})
