import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumMediaStatus } from '../../enums/media.enum';

/**
 * DTO for updating media status
 */
export class MediaUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumMediaStatus.active,
    description: 'New status for the media',
    required: true,
    enum: EnumMediaStatus,
  })
  @IsNotEmpty()
  @IsEnum(EnumMediaStatus)
  status: EnumMediaStatus;
}
