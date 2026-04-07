import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EnumMediaPurpose } from '../../enums/media.enum';
import { EnumAwsS3Accessibility } from '@/common/aws/enums/aws.enum';

/**
 * DTO for creating media metadata from raw data
 * @description Used when creating media record manually with all fields
 */
export class MediaCreateRequestDto {
  @ApiProperty({
    example: 'users/abc123/profile/photo.jpg',
    description: 'S3 object key',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  key: string;

  @ApiProperty({
    example: 'my-photo.jpg',
    description: 'Original filename',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'MIME type of the file',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  mimeType: string;

  @ApiProperty({
    example: 1024,
    description: 'File size in bytes',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  size: number;

  @ApiProperty({
    example: 'jpg',
    description: 'File extension without dot',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  extension: string;

  @ApiProperty({
    example: 'my-bucket',
    description: 'S3 bucket name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bucket: string;

  @ApiProperty({
    example: 'https://s3.example.com/bucket/key',
    description: 'Complete URL to access the file',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  completedUrl: string;

  @ApiProperty({
    example: 'https://cdn.example.com/key',
    description: 'CDN URL for fast delivery',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cdnUrl?: string;

  @ApiProperty({
    example: EnumMediaPurpose.general,
    description: 'Purpose/context of the media',
    required: false,
    enum: EnumMediaPurpose,
    default: EnumMediaPurpose.general,
  })
  @IsOptional()
  @IsEnum(EnumMediaPurpose)
  purpose?: EnumMediaPurpose;

  @ApiProperty({
    example: EnumAwsS3Accessibility.public,
    description: 'S3 accessibility level',
    required: false,
    enum: EnumAwsS3Accessibility,
    default: EnumAwsS3Accessibility.public,
  })
  @IsOptional()
  @IsEnum(EnumAwsS3Accessibility)
  access?: EnumAwsS3Accessibility;

  @ApiProperty({
    example: 'user-uuid-123',
    description: 'Owner entity ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({
    example: 'user',
    description: 'Owner entity type',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ownerType?: string;
}
