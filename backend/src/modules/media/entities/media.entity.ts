import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  EnumMediaStatus,
  EnumMediaType,
  EnumMediaPurpose,
} from '../enums/media.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { EnumAwsS3Accessibility } from '@/common/aws/enums/aws.enum';

export const MediaTableName = 'media';

/**
 * Media entity for storing file metadata
 * @description Stores metadata about files uploaded to S3/MinIO
 */
@DatabaseEntity({ collection: MediaTableName })
export class MediaEntity extends DatabaseEntityBase {
  /**
   * S3 Object Key - unique identifier in the bucket
   */
  @DatabaseProp({
    required: true,
    unique: true,
    index: true,
    trim: true,
    type: String,
  })
  key: string;

  /**
   * Original filename uploaded by user
   */
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 255,
    type: String,
  })
  filename: string;

  /**
   * MIME type of the file
   */
  @DatabaseProp({
    required: true,
    index: true,
    trim: true,
    maxlength: 100,
    type: String,
  })
  mimeType: string;

  /**
   * File size in bytes
   */
  @DatabaseProp({
    required: true,
    type: Number,
    min: 0,
  })
  size: number;

  /**
   * File extension (without dot)
   */
  @DatabaseProp({
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 20,
    type: String,
  })
  extension: string;

  /**
   * S3 bucket name
   */
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
    type: String,
  })
  bucket: string;

  /**
   * CDN URL for fast content delivery (optional)
   */
  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 500,
    type: String,
  })
  cdnUrl?: string;

  /**
   * Complete S3 URL to access the file
   */
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 500,
    type: String,
  })
  completedUrl: string;

  /**
   * Media type category (image, video, document, etc.)
   */
  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: EnumMediaType,
    default: EnumMediaType.other,
  })
  type: EnumMediaType;

  /**
   * Purpose/usage context of the media
   */
  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: EnumMediaPurpose,
    default: EnumMediaPurpose.General,
  })
  purpose: EnumMediaPurpose;

  /**
   * Media status (pending, active, archived)
   */
  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: EnumMediaStatus,
    default: EnumMediaStatus.pending,
  })
  status: EnumMediaStatus;

  /**
   * S3 accessibility level (public/private)
   */
  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: EnumAwsS3Accessibility,
    default: EnumAwsS3Accessibility.public,
  })
  access: EnumAwsS3Accessibility;

  /**
   * Reference to the owner entity ID (optional)
   */
  @DatabaseProp({
    required: false,
    index: true,
    trim: true,
    type: String,
  })
  ownerId?: string;

  /**
   * Type of the owner entity (user, care-record, etc.)
   */
  @DatabaseProp({
    required: false,
    index: true,
    trim: true,
    maxlength: 50,
    type: String,
  })
  ownerType?: string;
}

export const MediaSchema = DatabaseSchema(MediaEntity);

export type MediaDoc = IDatabaseDocument<MediaEntity>;
