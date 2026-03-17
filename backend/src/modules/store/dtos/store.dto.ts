import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ENUM_STORE_STATUS } from '../enums/store.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class StoreDto extends DatabaseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 300,
    description: 'Store name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 500,
    description: 'Store address',
  })
  @Expose()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 100,
    description: 'Store work hours',
  })
  @Expose()
  workHours: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 255,
    description: 'Store description',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 100,
    description: 'Store slug for URL',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    enum: ENUM_STORE_STATUS,
    required: true,
    description: 'Store status',
    example: ENUM_STORE_STATUS.ACTIVE,
  })
  @Expose()
  status: ENUM_STORE_STATUS;
}
