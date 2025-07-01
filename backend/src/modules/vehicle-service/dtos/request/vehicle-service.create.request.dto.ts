import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
  IsUUID,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../../enums/vehicle-service.enum';

export class VehicleServiceCreateRequestDto {
  @ApiProperty({
    example: 'Bảo dưỡng an toàn',
    description: 'Tên dịch vụ',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'bao-duong-an-toan',
    description:
      'Chuỗi thân thiện với URL, thường được tạo từ name (ví dụ: "bao-duong-xe-may", "bao-duong-tong-the"). Hữu ích cho SEO và URL đẹp.',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
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
    example: '0',
    description: 'Thứ tự sắp xếp khi hiển thị các dịch vụ',
    required: false,
    default: '0',
  })
  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsIn(Object.values(ENUM_VEHICLE_SERVICE_STATUS))
  @ApiProperty({
    example: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: ENUM_VEHICLE_SERVICE_STATUS,
    default: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
  })
  status?: ENUM_VEHICLE_SERVICE_STATUS;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  serviceCategory: string;
}
