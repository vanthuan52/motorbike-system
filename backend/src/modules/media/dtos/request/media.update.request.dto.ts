import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { MediaCreateRequestDto } from './media.create.request.dto';

/**
 * DTO for updating media metadata
 * @description Allows partial updates to filename, purpose, and owner info
 */
export class MediaUpdateRequestDto extends PartialType(
  PickType(MediaCreateRequestDto, [
    'filename',
    'purpose',
    'ownerId',
    'ownerType',
  ] as const),
) {}
