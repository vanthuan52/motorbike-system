import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RequestValidationException } from '@/common/request/exceptions/request.validation.exception';
import { MessageService } from '@/common/message/services/message.service';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';
import { ResponseMetadataDto } from '@/common/response/dtos/response.dto';
import { IMessageValidationError } from '@/common/message/interfaces/message.interface';
import { IAppException } from '../interfaces/app.interface';

@Catch(RequestValidationException)
export class AppValidationFilter implements ExceptionFilter {
  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async catch(
    exception: RequestValidationException,
    host: ArgumentsHost,
  ): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    // metadata
    const today = this.helperDateService.create();
    const xLanguage: string =
      request.__language ??
      this.configService.get<ENUM_MESSAGE_LANGUAGE>('message.language');
    const xTimestamp = this.helperDateService.getTimestamp(today);
    const xTimezone = this.helperDateService.getZone(today);
    const xVersion =
      request.__version ??
      this.configService.get<string>('app.versioning.version');
    const metadata: ResponseMetadataDto = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: request.path,
      version: xVersion,
    };

    // set response
    const message = this.messageService.setMessage(exception.message, {
      customLanguage: xLanguage,
    });
    const errors: IMessageValidationError[] =
      this.messageService.setValidationMessage(exception.errors, {
        customLanguage: xLanguage,
      });

    const responseBody: IAppException = {
      statusCode: exception.statusCode,
      message,
      errors,
      _metadata: metadata,
    };

    response
      .setHeader('x-custom-lang', xLanguage)
      .setHeader('x-timestamp', xTimestamp)
      .setHeader('x-timezone', xTimezone)
      .setHeader('x-version', xVersion)
      .status(exception.httpStatus)
      .json(responseBody);

    return;
  }
}
