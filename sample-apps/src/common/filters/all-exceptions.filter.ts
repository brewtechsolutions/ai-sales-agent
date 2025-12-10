import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errorCode = (exceptionResponse as any).errorCode || 'HTTP_ERROR';
      } else {
        message = exception.message;
        errorCode = 'HTTP_ERROR';
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handlePrismaError(exception);
      errorCode = 'DATABASE_ERROR';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database validation error';
      errorCode = 'VALIDATION_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'UNKNOWN_ERROR';
    }

    // Log the error
    this.logger.error(
      `Exception caught: ${message}`,
      {
        error: exception,
        request: {
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: request.body,
          query: request.query,
          params: request.params,
        },
        status,
        errorCode,
      },
    );

    // Send error response
    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    });
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): string {
    switch (error.code) {
      case 'P2002':
        return 'A record with this information already exists';
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Foreign key constraint failed';
      case 'P2014':
        return 'The change you are trying to make would violate the required relation';
      case 'P2016':
        return 'Query interpretation error';
      case 'P2021':
        return 'The table does not exist in the current database';
      case 'P2022':
        return 'The column does not exist in the current database';
      default:
        return 'Database operation failed';
    }
  }
}
