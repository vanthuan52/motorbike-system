import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { MessageService } from '@/common/message/services/message.service';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';
import { ResponseMetadataDto } from '@/common/response/dtos/response.dto';
import { IAppException } from '../interfaces/app.interface';

@Catch()
export class AppGeneralFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppGeneralFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    this.logger.error(exception);

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusHttp = exception.getStatus();

      httpAdapter.reply(ctx.getResponse(), response, statusHttp);
      return;
    }

    if (exception instanceof MongooseError.ValidationError) {
      this.logger.log('Caught a Mongoose ValidationError');

      const statusHttp = HttpStatus.BAD_REQUEST;
      const statusCode = HttpStatus.BAD_REQUEST;

      const messagePath = `http.${statusHttp}`;

      const errors = Object.keys(exception.errors).map((key) => {
        const error = exception.errors[key];

        return {
          property: error.path,
          constraints: {
            [error.kind]: error.message,
          },
        };
      });

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

      const message: string = this.messageService.setMessage(messagePath, {
        customLanguage: xLanguage,
      });

      const responseBody: IAppException = {
        statusCode,
        message,
        errors,
        _metadata: metadata,
      };

      response
        .setHeader('x-custom-lang', xLanguage)
        .setHeader('x-timestamp', xTimestamp)
        .setHeader('x-timezone', xTimezone)
        .setHeader('x-version', xVersion)
        .status(statusHttp)
        .json(responseBody);

      return;
    }

    // set default
    const statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const messagePath = `http.${statusHttp}`;
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

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

    const message: string = this.messageService.setMessage(messagePath, {
      customLanguage: xLanguage,
    });

    const responseBody: IAppException = {
      statusCode,
      message,
      _metadata: metadata,
    };

    response
      .setHeader('x-custom-lang', xLanguage)
      .setHeader('x-timestamp', xTimestamp)
      .setHeader('x-timezone', xTimezone)
      .setHeader('x-version', xVersion)
      .status(statusHttp)
      .json(responseBody);

    return;
  }
}
