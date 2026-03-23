import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';

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
  @ApiPropertyOptional({
    type: String,
    description: 'Thứ tự hiển thị',
  })
  @Expose()
  orderBy?: string;

  @ApiProperty({
    example: EnumVehicleBrandStatus.active,
    enum: EnumVehicleBrandStatus,
  })
  @Expose()
  status: EnumVehicleBrandStatus;
}
