import { HttpException, HttpStatus } from '@nestjs/common';
import { isSuccessfulStatus } from '@/common/utils/response-status.utils';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, data: any = null) {
    super(
      {
        status: isSuccessfulStatus(statusCode),
        statusCode,
        message,
        data,
      },
      statusCode,
    );
  }
}
