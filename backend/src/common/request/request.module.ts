import {
  DynamicModule,
  HttpStatus,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { RequestValidationException } from './exceptions/request.validation.exception';
import { RequestTimeoutInterceptor } from './interceptors/request.timeout.interceptor';
import { IsPasswordConstraint } from './validations/request.is-password.validation';
import { IsCustomEmailContraint } from './validations/request.custom-email.validation';

@Module({})
export class RequestModule {
  static forRoot(): DynamicModule {
    return {
      module: RequestModule,
      controllers: [],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: RequestTimeoutInterceptor,
        },
        {
          provide: APP_PIPE,
          useFactory: () =>
            new ValidationPipe({
              transform: true,
              skipUndefinedProperties: true,
              forbidUnknownValues: true,
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              exceptionFactory: async (errors: ValidationError[]) =>
                new RequestValidationException(errors),
            }),
        },
        IsPasswordConstraint,
        IsCustomEmailContraint,
      ],
    };
  }
}
