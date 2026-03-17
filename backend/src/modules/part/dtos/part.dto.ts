import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_PART_STATUS } from '../enums/part.enum';

export class PartDto extends DatabaseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 150,
    description: 'Part name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 200,
    description: 'Part slug for URL',
  })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 500,
    description: 'Part description',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    enum: ENUM_PART_STATUS,
    required: true,
    description: 'Part status',
    example: ENUM_PART_STATUS.ACTIVE,
  })
  @Expose()
  status: ENUM_PART_STATUS;

  @ApiPropertyOptional({
    type: String,
    description: 'Display order',
  })
  @Expose()
  order?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Part type ID',
  })
  @Expose()
  partType: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Vehicle brand ID',
  })
  @Expose()
  vehicleBrand: string;
}
