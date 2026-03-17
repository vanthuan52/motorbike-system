import { Module } from '@nestjs/common';
import {
  CACHE_MANAGER,
  CacheModule as CacheManagerModule,
  CacheOptions,
} from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { RedisClientCachedProvider } from '@/common/redis/constants/redis.constant';
import { SessionRepositoryModule } from './repository/session.repository.module';
import { SessionService } from './services/session.service';
import { SessionUtil } from './utils/session.util';
import { SessionCacheProvider } from './constants/session.constant';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, RedisClientCachedProvider],
      useFactory: (
        configService: ConfigService,
        redisClient: KeyvRedis<unknown>,
      ): CacheOptions => {
        return {
          stores: [redisClient],
          ttl: configService.get<number>('redis.cache.ttlInMs'),
        };
      },
    }),
    SessionRepositoryModule,
  ],
  exports: [SessionUtil, SessionService],
  providers: [
    SessionUtil,
    SessionService,
    {
      provide: SessionCacheProvider,
      useExisting: CACHE_MANAGER,
    },
  ],
  controllers: [],
})
export class SessionModule {}
