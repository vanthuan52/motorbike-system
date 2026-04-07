import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import { EnumVehicleServiceStatus } from '../../enums/vehicle-service.enum';

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
    example: 0,
    description: 'Thứ tự sắp xếp khi hiển thị các dịch vụ',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  orderBy?: number;

  @IsOptional()
  @IsIn(Object.values(EnumVehicleServiceStatus))
  @ApiProperty({
    example: EnumVehicleServiceStatus.active,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: EnumVehicleServiceStatus,
    default: EnumVehicleServiceStatus.active,
  })
  status?: EnumVehicleServiceStatus;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  serviceCategory: string;

  @ApiProperty({
    example: [faker.string.uuid()],
    required: true,
  })
  @IsArray()
  checklistItems: string[];
}
