import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;

  const isKnownError = error instanceof ApiError;
  const statusCode = isKnownError ? error.statusCode : 500;
  const message = isKnownError ? error.message : 'Internal server error';

  logger.error(message, {
    statusCode,
    details: isKnownError ? error.details : undefined,
    stack: env.NODE_ENV === 'production' ? undefined : error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(isKnownError && error.details ? { details: error.details } : {}),
  });
};
