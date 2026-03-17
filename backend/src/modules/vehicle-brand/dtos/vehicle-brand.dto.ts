import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';

export class VehicleBrandDto extends DatabaseDto {
  @ApiProperty({ example: 'Yamaha' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'yamaha' })
  @Expose()
  slug: string;

  @ApiPropertyOptional({ example: 'Hãng xe mô tô Nhật Bản' })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ example: 'Nhật Bản' })
  @Expose()
  country?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thứ tự hiển thị',
  })
  @Expose()
  order?: number;

  @ApiProperty({
    example: ENUM_VEHICLE_BRAND_STATUS.ACTIVE,
    enum: () => ENUM_VEHICLE_BRAND_STATUS,
  })
  @Expose()
  status: ENUM_VEHICLE_BRAND_STATUS;
}
