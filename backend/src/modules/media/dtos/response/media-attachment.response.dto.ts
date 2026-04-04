import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { MediaEmbeddedResponseDto } from './media.embedded.response.dto';

/**
 * Full response DTO for a MediaAttachment record.
 * Includes nested media information for display.
 */
export class MediaAttachmentResponseDto extends DatabaseDto {
  @ApiProperty({
    example: 'User',
    description: 'The type of entity this media is attached to',
    required: true,
  })
  attachableType: string;

  @ApiProperty({
    example: faker.database.mongodbObjectId(),
    description: 'The ID of the entity this media is attached to',
    required: true,
  })
  attachableId: string;

  @ApiProperty({
    example: faker.database.mongodbObjectId(),
    description: 'The media file ID',
    required: true,
  })
  mediaId: string;

  @ApiProperty({
    example: 'avatar',
    description: 'The purpose/role of this attachment',
    required: true,
  })
  purpose: string;

  @ApiProperty({
    example: 'Front view of vehicle',
    description: 'Caption for the media',
    required: false,
  })
  caption?: string;

  @ApiProperty({
    example: 0,
    description: 'Sort order',
    required: true,
  })
  orderBy: number;

  @ApiProperty({
    description: 'Nested media file details',
    required: false,
    type: () => MediaEmbeddedResponseDto,
  })
  media?: MediaEmbeddedResponseDto;
}

/**
 * Lightweight DTO for listing attachments (e.g. in entity detail views).
 * Contains only the most essential fields + media URL.
 */
export class MediaAttachmentListResponseDto {
  @ApiProperty({
    example: faker.database.mongodbObjectId(),
    description: 'Attachment ID',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'avatar',
    description: 'Purpose of the attachment',
    required: true,
  })
  purpose: string;

  @ApiProperty({
    example: 'Front view',
    description: 'Caption',
    required: false,
  })
  caption?: string;

  @ApiProperty({
    example: 0,
    description: 'Sort order',
    required: true,
  })
  orderBy: number;

  @ApiProperty({
    description: 'Nested media info',
    required: false,
    type: () => MediaEmbeddedResponseDto,
  })
  media?: MediaEmbeddedResponseDto;
}
