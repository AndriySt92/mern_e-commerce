import { ErrorRequestHandler } from 'express'

import { getErrorResponse } from '../utils/getErrorResponse'
import { IHttpError } from '../interfaces/errorInterfaces'

interface IErrorResponse {
  status: number
  message: string
  stack?: string
}

export const errorHandler: ErrorRequestHandler = (err: IHttpError, _req, res, _next): void => {
  // Check if error is from httpError factory
  if (err instanceof Error && typeof err.status === 'number') {
    res.status(err.status).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
    })
    return
  }

  const errorResponse: IErrorResponse = getErrorResponse(err)

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack
  }

  res.status(errorResponse.status).json({
    status: 'error',
    message: errorResponse.message,
    ...(errorResponse.stack && { stack: errorResponse.stack }),
  })
}
