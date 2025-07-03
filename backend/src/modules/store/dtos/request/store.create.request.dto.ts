import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ENUM_STORE_STATUS } from '../../enums/store.enum';

export class StoreCreateRequestDto {
  @ApiProperty({
    example: 'Cửa hàng ABC',
    description: 'Tên cửa hàng',
    required: true,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ cửa hàng',
    required: true,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @ApiProperty({
    example: '8:00 - 18:00',
    description: 'Giờ làm việc',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  workHours: string;

  @ApiProperty({
    example: 'Phụ tùng giúp lọc không khí trước khi vào động cơ.',
    description: 'Mô tả chi tiết (có thể bỏ trống)',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    example: 'cua-hang-abc',
    description: 'Slug của cửa hàng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    example: ENUM_STORE_STATUS.ACTIVE,
    description: 'Trạng thái của cửa hàng',
    required: true, // cần xem lại
    enum: ENUM_STORE_STATUS,
    default: ENUM_STORE_STATUS.ACTIVE,
  })
  @IsIn(Object.values(ENUM_STORE_STATUS))
  @IsString()
  status: ENUM_STORE_STATUS;
}
