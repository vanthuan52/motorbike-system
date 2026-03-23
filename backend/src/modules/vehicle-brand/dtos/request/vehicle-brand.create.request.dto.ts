import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { EnumVehicleBrandStatus } from '../../enums/vehicle-brand.enum';

export class VehicleBrandCreateRequestDto {
  @ApiProperty({
    example: 'Yamaha',
    description: 'Tên hãng xe',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'yamaha',
    description:
      'Chuỗi thân thiện với URL, thường được tạo từ name (ví dụ: "yamaha", "honda"). Hữu ích cho SEO và URL đẹp.',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    example: 'Some description',
    description: 'Mô tả chi tiết (có thể bỏ trống)',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 'Some country name',
    description: 'Tên quốc gia của hãng (có thể bỏ trống)',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({
    example: '0',
    description: 'Thứ tự sắp xếp khi hiển thị các hãng xe',
    required: false,
    default: '0',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsIn(Object.values(EnumVehicleBrandStatus))
  @ApiProperty({
    example: EnumVehicleBrandStatus.active,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: EnumVehicleBrandStatus,
    default: EnumVehicleBrandStatus.active,
  })
  status?: EnumVehicleBrandStatus;
}
