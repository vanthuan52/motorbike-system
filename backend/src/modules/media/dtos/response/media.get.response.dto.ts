import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  EnumMediaPurpose,
  EnumMediaStatus,
  EnumMediaType,
} from '../../enums/media.enum';
import { EnumAwsS3Accessibility } from '@/common/aws/enums/aws.enum';

/**
 * Full media response DTO
 * @description Contains all media metadata for detailed view
 */
export class MediaGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: 'users/abc123/profile/photo.jpg',
    description: 'S3 object key',
    required: true,
  })
  key: string;

  @ApiProperty({
    example: 'my-photo.jpg',
    description: 'Original filename',
    required: true,
  })
  filename: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'MIME type of the file',
    required: true,
  })
  mimeType: string;

  @ApiProperty({
    example: 1024,
    description: 'File size in bytes',
    required: true,
  })
  size: number;

  @ApiProperty({
    example: 'jpg',
    description: 'File extension',
    required: true,
  })
  extension: string;

  @ApiProperty({
    example: 'my-bucket',
    description: 'S3 bucket name',
    required: true,
  })
  bucket: string;

  @ApiProperty({
    example: 'https://s3.example.com/bucket/key',
    description: 'Complete URL to access the file',
    required: true,
  })
  completedUrl: string;

  @ApiProperty({
    example: 'https://cdn.example.com/key',
    description: 'CDN URL for fast delivery',
    required: false,
  })
  cdnUrl?: string;

  @ApiProperty({
    example: EnumMediaType.image,
    description: 'Media type category',
    required: true,
    enum: EnumMediaType,
  })
  type: EnumMediaType;

  @ApiProperty({
    example: EnumMediaPurpose.profilePhoto,
    description: 'Purpose/context of the media',
    required: true,
    enum: EnumMediaPurpose,
  })
  purpose: EnumMediaPurpose;

  @ApiProperty({
    example: EnumMediaStatus.active,
    description: 'Media status',
    required: true,
    enum: EnumMediaStatus,
  })
  status: EnumMediaStatus;

  @ApiProperty({
    example: EnumAwsS3Accessibility.public,
    description: 'S3 accessibility level',
    required: true,
    enum: EnumAwsS3Accessibility,
  })
  access: EnumAwsS3Accessibility;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Owner entity ID',
    required: false,
  })
  ownerId?: string;

  @ApiProperty({
    example: 'user',
    description: 'Owner entity type',
    required: false,
  })
  ownerType?: string;
}
