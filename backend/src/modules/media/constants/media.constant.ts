import { EnumMediaStatus } from '../enums/media.enum';

/**
 * File size limits (in bytes)
 */
export const MediaMaxFileSize = 50 * 1024 * 1024; // 50MB
export const MediaMaxImageSize = 10 * 1024 * 1024; // 10MB
export const MediaMaxVideoSize = 100 * 1024 * 1024; // 100MB
export const MediaMaxDocumentSize = 20 * 1024 * 1024; // 20MB

/**
 * Allowed MIME types by category
 */
export const MediaAllowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export const MediaAllowedVideoTypes = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
] as const;

export const MediaAllowedDocumentTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const MediaAllowedAudioTypes = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
] as const;

/**
 * All allowed MIME types
 */
export const MediaAllowedMimeTypes = [
  ...MediaAllowedImageTypes,
  ...MediaAllowedVideoTypes,
  ...MediaAllowedDocumentTypes,
  ...MediaAllowedAudioTypes,
] as const;

/**
 * List query defaults
 */
export const MediaDefaultAvailableSearch = ['filename', 'key'];

export const MediaDefaultStatus = [
  EnumMediaStatus.active,
  EnumMediaStatus.pending,
];

export const MediaDefaultAvailableOrderBy = ['createdAt', 'filename', 'size'];

/**
 * Upload path templates
 */
export const MediaUploadPathTemplate = {
  ProfilePhoto: 'users/{userId}/profile',
  CareRecord: 'care-records/{recordId}',
  Vehicle: 'vehicles/{vehicleId}',
  Chat: 'chat/{conversationId}',
  General: 'general/{date}',
} as const;
