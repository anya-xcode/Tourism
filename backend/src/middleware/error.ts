import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose: malformed ObjectId in a URL or body
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path === '_id' ? 'id' : err.path}`;
  }
  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {}).map((e: any) => e.message).join('. ') || 'Validation failed';
  }

  if (statusCode >= 500) console.error(err.stack);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
