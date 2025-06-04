import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { MessageService } from '@/common/message/services/message.service';
import { ResponseDto, ResponseMetadataDto } from '../dtos/response.dto';
import { HelperDateService } from '@/common/helper/services/helper.date.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
} from '../constants/response.constant';
import { IMessageOptionsProperties } from '@/common/message/interfaces/message.interface';
import { ENUM_MESSAGE_LANGUAGE } from '@/common/message/enums/message.enum';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<Promise<ResponseDto>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<ResponseDto>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<any>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: IRequestApp = ctx.getRequest<IRequestApp>();

          let messagePath: string = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH_META_KEY,
            context.getHandler(),
          );
          let messageProperties: IMessageOptionsProperties =
            this.reflector.get<IMessageOptionsProperties>(
              RESPONSE_MESSAGE_PROPERTIES_META_KEY,
              context.getHandler(),
            );

          // set default response
          let httpStatus: HttpStatus = response.statusCode;
          let statusCode: number = response.statusCode;
          let data: Record<string, any> | undefined = undefined;

          // metadata
          const today = this.helperDateService.create();
          const xPath = request.path;
          const xLanguage: string =
            request.__language ??
            this.configService.get<ENUM_MESSAGE_LANGUAGE>('message.language');
          const xTimestamp = this.helperDateService.getTimestamp(today);
          const xTimezone = this.helperDateService.getZone(today);
          const xVersion =
            request.__version ??
            this.configService.get<string>('app.urlVersion.version');

          let metadata: ResponseMetadataDto = {
            language: xLanguage,
            timestamp: xTimestamp,
            timezone: xTimezone,
            path: xPath,
            version: xVersion,
          };

          // response
          const responseData = (await res) as IResponse<any>;

          if (responseData) {
            const { _metadata } = responseData;

            data = responseData.data;
            httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
            statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
            messagePath = _metadata?.customProperty?.message ?? messagePath;
            messageProperties =
              _metadata?.customProperty?.messageProperties ?? messageProperties;

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

          response.setHeader('x-custom-lang', xLanguage);
          response.setHeader('x-timestamp', xTimestamp);
          response.setHeader('x-timezone', xTimezone);
          response.setHeader('x-version', xVersion);
          response.status(httpStatus);

          return {
            statusCode,
            message,
            _metadata: metadata,
            data,
          };
        }),
      );
    }

    return next.handle();
  }
}
