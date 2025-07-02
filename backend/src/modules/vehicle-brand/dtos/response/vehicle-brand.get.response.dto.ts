import { ApiProperty } from '@nestjs/swagger';
import { ENUM_VEHICLE_BRAND_STATUS } from '../../enums/vehicle-brand.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class VehicleBrandGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Yamaha' })
  name: string;

  @ApiProperty({ example: 'yamaha' })
  slug: string;

  @ApiProperty({ example: 'Yamahaha', required: false })
  description?: string;

  @ApiProperty({ example: 'Nhật Bản', required: false })
  country?: string;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Thứ tự hiển thị hãng xe',
  })
  order?: string;

  @ApiProperty({
    required: true,
    example: ENUM_VEHICLE_BRAND_STATUS.ACTIVE,
    enum: () => ENUM_VEHICLE_BRAND_STATUS,
  })
  status: ENUM_VEHICLE_BRAND_STATUS;
}
