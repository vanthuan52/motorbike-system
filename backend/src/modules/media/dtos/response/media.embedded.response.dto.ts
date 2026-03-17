import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

/**
 * Lightweight embedded media DTO for storing in other entities
 * @description Use this DTO when embedding media info in other documents (user.photo, etc.)
 * Contains only essential fields needed for display and URL access
 */
export class MediaEmbeddedResponseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Media ID',
    required: true,
  })
  _id: string;

  @ApiProperty({
    example: 'users/abc123/profile/photo.jpg',
    description: 'S3 object key',
    required: true,
  })
  key: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'MIME type of the file',
    required: true,
  })
  mimeType: string;

  @ApiProperty({
    example: 'https://s3.example.com/bucket/key',
    description: 'Complete URL to access the file',
    required: false,
  })
  completedUrl?: string;

  @ApiProperty({
    example: 'https://cdn.example.com/key',
    description: 'CDN URL for fast delivery',
    required: false,
  })
  cdnUrl?: string;
}
