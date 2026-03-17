import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { PaginationModule } from './pagination/pagination.module';
import { PolicyModule } from '@/modules/policy/policy.module';
import { HelperModule } from './helper/helper.module';
import { MessageModule } from './message/message.module';
import { DatabaseOptionService } from './database/services/database.options.service';
import { DATABASE_CONNECTION_NAME } from './database/constants/database.constant';
import {
  DatabaseModule,
  DatabaseOptionModule,
} from './database/database.module';
import configs from 'src/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { RequestModule } from './request/request.module';
import { RedisCacheModule } from './redis/redis.module';
import { CacheMainModule } from '@/common/cache/cache.module';
import { QueueRegisterModule } from '@/queues/queue.register.module';
import { FileModule } from './file/file.module';
import { SessionModule } from '@/modules/session/session.module';
import { RoleModule } from '@/modules/role/role.module';

/**
 * Common module that provides shared functionality across the application.
 * Configures global services including configuration, caching, logging, database, authentication, and pagination.
 */

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      cache: true,
      envFilePath: [`.env`, `.env.${process.env.NODE_ENV || 'development'}`],
      expandVariables: false,
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionModule],
      inject: [DatabaseOptionService],
      useFactory: (databaseService: DatabaseOptionService) =>
        databaseService.createOptions(),
    }),
    DatabaseModule.forRoot(),
    MessageModule.forRoot(),
    LoggerModule.forRoot(),
    RedisCacheModule.forRoot(),
    CacheMainModule.forRoot(),
    QueueRegisterModule.forRoot(),
    RequestModule.forRoot(),

    HelperModule,
    PaginationModule,
    FileModule,

    PolicyModule,
    AuthModule,
    RoleModule,
    SessionModule,
  ],
})
export class CommonModule {}
