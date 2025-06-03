import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { MessageService } from '@/common/message/services/message.service';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IMessageOptionsProperties } from '@/common/message/interfaces/message.interface';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';
import { ResponseMetadataDto } from '@/common/response/dtos/response.dto';
import { IAppException } from '../interfaces/app.interface';

@Catch(HttpException)
export class AppHttpFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppHttpFilter.name);

  private readonly globalPrefix: string;
  private readonly docPrefix: string;

  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {
    this.globalPrefix = this.configService.get<string>('app.globalPrefix')!;
    this.docPrefix = this.configService.get<string>('docs.prefix')!;
  }

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequestApp = ctx.getRequest<IRequestApp>();

    if (
      !request.path.startsWith(this.globalPrefix) &&
      !request.path.startsWith(this.docPrefix)
    ) {
      response.redirect(
        HttpStatus.PERMANENT_REDIRECT,
        `${this.globalPrefix}/public/hello`,
      );

      return;
    }

    // set default
    let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messagePath = `http.${statusHttp}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageProperties: IMessageOptionsProperties | undefined;
    let data: Record<string, any> | undefined;

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

    let metadata: ResponseMetadataDto = {
      language: xLanguage,
      timestamp: xTimestamp,
      timezone: xTimezone,
      path: request.path,
      version: xVersion,
    };

    // Restructure
    const responseException = exception.getResponse();
    statusHttp = exception.getStatus();
    messagePath = `http.${statusHttp}`;
    statusCode = exception.getStatus();

    if (this.isErrorException(responseException)) {
      const { _metadata } = responseException;

      statusCode = responseException.statusCode;
      messagePath = responseException.message;
      data = responseException.data;
      messageProperties = _metadata?.customProperty?.messageProperties;
      delete _metadata?.customProperty;

      metadata = {
        ...metadata,
        ..._metadata,
      };
    }

    const message: string = this.messageService.setMessage(messagePath, {
      customLanguage: xLanguage,
      properties: messageProperties,
    });

    const responseBody: IAppException = {
      statusCode,
      message,
      _metadata: metadata,
      data,
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

  isErrorException(obj: any): obj is IAppException {
    return typeof obj === 'object'
      ? 'statusCode' in obj && 'message' in obj
      : false;
  }
}
