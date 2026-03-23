import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class CareAreaDto extends DatabaseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 250,
    description: 'Care area name',
    example: 'Bộ phận nồi',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 500,
    description: 'Care area description',
    example: 'Bộ phận nồi',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Display order',
    example: '0',
  })
  @Expose()
  orderBy?: string;
}
