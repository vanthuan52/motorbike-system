import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { EnumPartTypeStatus } from '../enums/part-type.enum';

export class PartTypeDto extends DatabaseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 100,
    description: 'Part type name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 150,
    description: 'Part type slug for URL',
  })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 255,
    description: 'Part type description',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 20,
    description: 'Display order',
  })
  @Expose()
  order?: string;

  @ApiProperty({
    enum: EnumPartTypeStatus,
    required: true,
    description: 'Part type status',
    example: EnumPartTypeStatus.active,
  })
  @Expose()
  status: EnumPartTypeStatus;

  @ApiPropertyOptional({
    type: String,
    description: 'Part type photo URL',
  })
  @Expose()
  photo?: string;
}
