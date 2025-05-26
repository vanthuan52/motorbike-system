import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import configs from '@/config';
import { LoggerMiddleware } from './app/middleware/logger.middleware';
import { UsersModule } from './modules/user/user.module';
import { DATABASE_CONNECTION_NAME } from './common/database/constants/database.constant';
import { DatabaseOptionModule } from './common/database/database.module';
import { DatabaseOptionService } from './common/database/services/database.options.service';
import { MessageModule } from './common/message/message.module';
import { HelperModule } from './common/helper/helper.module';
import { LoggerOptionModule } from './common/logger/logger.option.module';
import { LoggerOptionService } from './common/logger/services/logger.option.service';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'production'}`,
      expandVariables: false,
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionModule],
      inject: [DatabaseOptionService],
      useFactory: (databaseService: DatabaseOptionService) =>
        databaseService.createOptions(),
    }),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerOptionModule],
      inject: [LoggerOptionService],
      useFactory: async (loggerOptionService: LoggerOptionService) => {
        return loggerOptionService.createOptions();
      },
    }),
    MessageModule.forRoot(),
    HelperModule.forRoot(),
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
