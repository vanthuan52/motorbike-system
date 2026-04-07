import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PaginationModule } from './pagination/pagination.module';
import { PolicyModule } from '@/modules/policy/policy.module';
import { HelperModule } from './helper/helper.module';
import { MessageModule } from './message/message.module';
import { DatabaseModule } from './database/database.module';
import configs from '@/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { RequestModule } from './request/request.module';
import { RedisCacheModule } from './redis/redis.module';
import { CacheMainModule } from '@/common/cache/cache.module';
import { QueueRegisterModule } from '@/queues/queue.register.module';
import { FileModule } from './file/file.module';
import { SessionModule } from '@/modules/session/session.module';
import { RoleModule } from '@/modules/role/role.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ActivityLogModule } from '@/modules/activity-log/activity-log.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { NotificationModule } from '@/modules/notification/notification.module';

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
    MessageModule.forRoot(),
    LoggerModule.forRoot(),
    RedisCacheModule.forRoot(),
    QueueRegisterModule.forRoot(),
    CacheMainModule.forRoot(),
    DatabaseModule.forRoot(),
    RequestModule.forRoot(),

    HelperModule,
    PaginationModule,
    FileModule,
    FirebaseModule,

    ActivityLogModule,
    ApiKeyModule,
    AuthModule,
    RoleModule,
    PolicyModule,
    SessionModule,
    NotificationModule,
  ],
})
export class CommonModule {}
