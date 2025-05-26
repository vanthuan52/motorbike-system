import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { isSuccessfulStatus } from '@/common/utils/response-status.utils';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly configService = new ConfigService();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse.message
        : exceptionResponse;

    this.logger.error(`Error ${status}: ${JSON.stringify(message)}`);

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.status(status).json(
      isProduction
        ? {
            status: isSuccessfulStatus(status),
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            data: null,
          }
        : {
            status: isSuccessfulStatus(status),
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            data: null,
            stacktrace: exception.stack,
          },
    );
  }
}
