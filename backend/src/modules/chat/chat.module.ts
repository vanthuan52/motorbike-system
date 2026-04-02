import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import {
  CACHE_MANAGER,
  CacheModule as CacheManagerModule,
  CacheOptions,
} from '@nestjs/cache-manager';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MessageService } from './services/message.service';
import { ConversationService } from './services/conversation.service';
import { PresenceService } from './services/presence.service';
import { MessageRepository } from './repository/message.repository';
import { ConversationRepository } from './repository/conversation.repository';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { ConversationController } from './controllers/conversation.controller';
import { MessageSharedController } from './controllers/message.controller';
import { MessageGateway } from './chat.gateway';
import { RedisClientCachedProvider } from '@/common/redis/constants/redis.constant';
import { PresenceCacheProvider } from './constants/presence.constant';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CacheManagerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, RedisClientCachedProvider],
      useFactory: (
        configService: ConfigService,
        redisClient: KeyvRedis<unknown>
      ): CacheOptions => {
        return {
          stores: [redisClient],
          ttl: configService.get<number>('redis.cache.ttlInMs'),
        };
      },
    }),
  ],
  controllers: [ConversationController, MessageSharedController],
  providers: [
    // Services
    MessageService,
    ConversationService,
    PresenceService,

    // Repositories
    MessageRepository,
    ConversationRepository,

    // Gateway & Guards
    MessageGateway,
    WsJwtGuard,

    // Cache Provider (Redis)
    {
      provide: PresenceCacheProvider,
      useExisting: CACHE_MANAGER,
    },
  ],
  exports: [MessageService, ConversationService, PresenceService],
})
export class ChatModule {}
