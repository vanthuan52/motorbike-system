export const PresenceCacheProvider = 'PresenceCacheProvider';

/**
 * Redis key pattern for presence entries.
 * Format: presence:{userId}
 */
export const PRESENCE_KEY_PREFIX = 'presence';

/**
 * Default TTL for presence entries (in milliseconds).
 * 30 minutes — nếu không có heartbeat, user tự động offline.
 */
export const PRESENCE_TTL_MS = 30 * 60 * 1000;
