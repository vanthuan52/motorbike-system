import { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import {
  PRESENCE_KEY_PREFIX,
  PRESENCE_TTL_MS,
  PresenceCacheProvider,
} from '../constants/presence.constant';

export interface IPresenceEntry {
  socketId: string;
  connectedAt: string;
}

/**
 * Presence Service (Redis-backed)
 *
 * Manages user online/offline status using Redis cache.
 *
 * ✅ Data survives across server restarts
 * ✅ Shared state — any service/module can query
 * ✅ TTL tự động — phát hiện zombie connections (30 phút không heartbeat)
 * ✅ Ready for horizontal scaling (multi-instance)
 *
 * Key pattern: `presence:{userId}`
 * TTL: 30 minutes (auto-expire nếu không renew)
 */
@Injectable()
export class PresenceService {
  constructor(
    @Inject(PresenceCacheProvider) private readonly cacheManager: Cache
  ) {}

  /**
   * Xây dựng cache key cho user.
   */
  private buildKey(userId: string): string {
    return `${PRESENCE_KEY_PREFIX}:${userId}`;
  }

  /**
   * Đánh dấu user online.
   * Lưu socketId vào Redis với TTL 30 phút.
   */
  async setOnline(userId: string, socketId: string): Promise<void> {
    const key = this.buildKey(userId);
    const entry: IPresenceEntry = {
      socketId,
      connectedAt: new Date().toISOString(),
    };

    await this.cacheManager.set<IPresenceEntry>(key, entry, PRESENCE_TTL_MS);
  }

  /**
   * Đánh dấu user offline.
   * Xoá entry khỏi Redis.
   */
  async setOffline(userId: string): Promise<void> {
    const key = this.buildKey(userId);
    await this.cacheManager.del(key);
  }

  /**
   * Kiểm tra user có đang online không.
   */
  async isOnline(userId: string): Promise<boolean> {
    const key = this.buildKey(userId);
    const entry = await this.cacheManager.get<IPresenceEntry>(key);
    return !!entry;
  }

  /**
   * Lấy socketId của user (nếu online).
   */
  async getSocketId(userId: string): Promise<string | null> {
    const key = this.buildKey(userId);
    const entry = await this.cacheManager.get<IPresenceEntry>(key);
    return entry?.socketId ?? null;
  }

  /**
   * Gia hạn TTL cho user đang online.
   * Gọi định kỳ (heartbeat) để tránh bị TTL expire khi user vẫn đang active.
   */
  async renewPresence(userId: string): Promise<void> {
    const key = this.buildKey(userId);
    const entry = await this.cacheManager.get<IPresenceEntry>(key);

    if (entry) {
      await this.cacheManager.set<IPresenceEntry>(key, entry, PRESENCE_TTL_MS);
    }
  }

  /**
   * Lọc danh sách userIds → chỉ trả về những user đang online.
   */
  async getOnlineUsers(userIds: string[]): Promise<string[]> {
    const results = await Promise.all(
      userIds.map(async id => ({
        id,
        online: await this.isOnline(id),
      }))
    );

    return results.filter(r => r.online).map(r => r.id);
  }
}
