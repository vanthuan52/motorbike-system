import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PaginationModule } from './pagination/pagination.module';
import { PolicyModule } from '@/modules/policy/policy.module';
import { HelperModule } from './helper/helper.module';
import { MessageModule } from './message/message.module';
import { LoggerOptionService } from './logger/services/logger.option.service';
import { LoggerOptionModule } from './logger/logger.option.module';
import { DatabaseOptionService } from './database/services/database.options.service';
import { DATABASE_CONNECTION_NAME } from './database/constants/database.constant';
import {
  DatabaseModule,
  DatabaseOptionModule,
} from './database/database.module';
import configs from 'src/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { RequestModule } from './request/request.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      cache: true,
      envFilePath: `.env.${process.env.APP_ENV || 'production'}`,
      expandVariables: false,
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionModule],
      inject: [DatabaseOptionService],
      useFactory: (databaseService: DatabaseOptionService) =>
        databaseService.createOptions(),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheOptions> => ({
        max: configService.get<number>('redis.cached.max'),
        ttl: configService.get<number>('redis.cached.ttl'),
        stores: [],
      }),
      inject: [ConfigService],
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
    RequestModule.forRoot(),
    PolicyModule.forRoot(),
    AuthModule.forRoot(),
    DatabaseModule.forRoot(),
    PaginationModule.forRoot(),
  ],
})
export class CommonModule {}
