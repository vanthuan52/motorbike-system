import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { AppGeneralFilter } from './filters/app.general.filter';
import { AppHttpFilter } from './filters/app.http.filter';
import { AppValidationFilter } from './filters/app.validation.filter';
import { AppRequestIdMiddleware } from './middleware/app.request-id.middleware';
import { AppHelmetMiddleware } from './middleware/app.helmet.middleware';
import {
  AppJsonBodyParserMiddleware,
  AppRawBodyParserMiddleware,
  AppTextBodyParserMiddleware,
  AppUrlencodedBodyParserMiddleware,
} from './middleware/app.body-parser.middleware';
import { AppCorsMiddleware } from './middleware/app.cors.middleware';
import { AppUrlVersionMiddleware } from './middleware/app.url-version.middleware';
import { AppResponseTimeMiddleware } from './middleware/app.response-time.middleware';
import { AppCustomLanguageMiddleware } from './middleware/app.custom-language.middleware';

@Module({
  controllers: [],
  exports: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AppGeneralFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppValidationFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppHttpFilter,
    },
  ],
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: config.get<number>('middleware.throttle.ttl')!,
            limit: config.get<number>('middleware.throttle.limit')!,
          },
        ],
      }),
    }),
  ],
})
export class AppMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AppRequestIdMiddleware,
        AppHelmetMiddleware,
        AppJsonBodyParserMiddleware,
        AppTextBodyParserMiddleware,
        AppRawBodyParserMiddleware,
        AppUrlencodedBodyParserMiddleware,
        AppCorsMiddleware,
        AppUrlVersionMiddleware,
        AppResponseTimeMiddleware,
        AppCustomLanguageMiddleware,
      )
      .forRoutes('{*wildcard}');
  }
}
