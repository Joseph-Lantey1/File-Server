import { Request, Response, NextFunction } from 'express';

class CustomError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number = 500, status: string = 'error') {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation error', statusCode: number = 400) {
    super(message, statusCode, 'validation-error');
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database error', statusCode: number = 500) {
    super(message, statusCode, 'database-error');
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication error', statusCode: number = 401) {
    super(message, statusCode, 'authentication-error');
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Authorization error', statusCode: number = 403) {
    super(message, statusCode, 'authorization-error');
  }
}

export const errorHandlingMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
     if (error instanceof CustomError) {
      // Handle other expected errors, don't expose their details in the response body
      return res.status(error.statusCode).json({
        status: error.status,
        message: 'An error occurred.',
      });
    } else {
      // Handle unexpected errors and log them
      console.error('Unexpected error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };
