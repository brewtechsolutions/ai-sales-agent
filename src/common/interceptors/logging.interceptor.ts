import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip || request.connection.remoteAddress;

    const now = Date.now();

    // Log request
    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      {
        method,
        url,
        body: this.sanitizeBody(body),
        query,
        params,
        userAgent,
        ip,
        timestamp: new Date().toISOString(),
      },
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          const statusCode = response.statusCode;

          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${statusCode} (${duration}ms)`,
            {
              method,
              url,
              statusCode,
              duration,
              responseSize: JSON.stringify(data).length,
              timestamp: new Date().toISOString(),
            },
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = error.status || 500;

          this.logger.error(
            `Request Error: ${method} ${url} - ${statusCode} (${duration}ms)`,
            {
              method,
              url,
              statusCode,
              duration,
              error: error.message,
              stack: error.stack,
              timestamp: new Date().toISOString(),
            },
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
