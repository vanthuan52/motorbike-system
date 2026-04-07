import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  EnumMediaAttachableType,
  EnumMediaAttachmentPurpose,
} from '../../enums/media-attachment.enum';

/**
 * DTO for attaching a media file to an entity.
 */
export class MediaAttachmentAttachRequestDto {
  @ApiProperty({
    example: EnumMediaAttachableType.User,
    description: 'The type of entity to attach media to',
    required: true,
    enum: EnumMediaAttachableType,
  })
  @IsNotEmpty()
  @IsEnum(EnumMediaAttachableType)
  attachableType: EnumMediaAttachableType;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the entity to attach media to',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  attachableId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'The ID of the Media file to attach',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  mediaId: string;

  @ApiProperty({
    example: EnumMediaAttachmentPurpose.avatar,
    description: 'The purpose/role of this media within the entity',
    required: false,
    enum: EnumMediaAttachmentPurpose,
    default: EnumMediaAttachmentPurpose.default,
  })
  @IsOptional()
  @IsEnum(EnumMediaAttachmentPurpose)
  purpose?: EnumMediaAttachmentPurpose;

  @ApiProperty({
    example: 'Front view of the vehicle',
    description: 'Optional caption for the media',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiProperty({
    example: 0,
    description: 'Sort order for multiple attachments',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @MaxLength(10)
  orderBy?: number;
}
