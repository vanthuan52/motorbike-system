import { ApiProperty, PickType } from '@nestjs/swagger';
import { MediaGetResponseDto } from './media.get.response.dto';

/**
 * Media list response DTO
 * @description Simplified media info for list views
 */
export class MediaListResponseDto extends PickType(MediaGetResponseDto, [
  'id',
  'key',
  'filename',
  'mimeType',
  'size',
  'type',
  'purpose',
  'status',
  'completedUrl',
  'cdnUrl',
  'createdAt',
] as const) {}
