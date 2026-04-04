import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { EnumPartStatus } from '../enums/part.enum';

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
    enum: EnumPartStatus,
    required: true,
    description: 'Part status',
    example: EnumPartStatus.active,
  })
  @Expose()
  status: EnumPartStatus;

  @ApiPropertyOptional({
    type: String,
    description: 'Display order',
  })
  @Expose()
  orderBy?: number;

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
