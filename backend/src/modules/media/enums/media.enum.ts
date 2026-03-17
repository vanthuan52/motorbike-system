/**
 * Media status lifecycle
 * @description Represents the lifecycle state of uploaded media
 */
export enum EnumMediaStatus {
  /** Uploaded but not yet confirmed/attached to an entity */
  pending = 'pending',
  /** Confirmed and actively in use */
  active = 'active',
  /** Soft archived, not visible but recoverable */
  archived = 'archived',
}

/**
 * Media type categories
 * @description Categorizes media by content type
 */
export enum EnumMediaType {
  image = 'image',
  video = 'video',
  document = 'document',
  audio = 'audio',
  other = 'other',
}

/**
 * Media purpose/usage context
 * @description Defines the context where media is used
 */
export enum EnumMediaPurpose {
  ProfilePhoto = 'profile_photo',
  CareRecord = 'care_record',
  CareRecordMedia = 'care_record_media',
  Vehicle = 'vehicle',
  VehicleBrand = 'vehicle_brand',
  ChatAttachment = 'chat_attachment',
  Store = 'store',
  General = 'general',
}
