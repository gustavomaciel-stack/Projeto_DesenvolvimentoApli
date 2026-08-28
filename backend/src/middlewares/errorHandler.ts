import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err.stack ?? err.message);
  res.status(500).json({
    message: 'Internal Server Error',
  });
};
