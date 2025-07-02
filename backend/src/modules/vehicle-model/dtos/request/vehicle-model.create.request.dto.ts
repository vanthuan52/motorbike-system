import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../../enums/vehicle-model.enum';

export class VehicleModelCreateRequestDto {
  @ApiProperty({
    example: 'Wave Alpha 110',
    description: 'Tên dòng xe',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'Honda Wave Alpha 110 2019',
    description: 'Tên dòng xe đầy đủ',
    required: true,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @ApiProperty({
    example: 'honda-wave-alpha-110-2019',
    description:
      'Chuỗi thân thiện với URL, thường được tạo từ name (ví dụ: "honda-wave-alpha-110-2019", "honda-wave-alpha-110-2018"). Hữu ích cho SEO và URL đẹp.',
    required: true,
    maxLength: 250,
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
  @IsIn(Object.values(ENUM_VEHICLE_MODEL_STATUS))
  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: ENUM_VEHICLE_MODEL_STATUS,
    default: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
  })
  status?: ENUM_VEHICLE_MODEL_STATUS;

  @IsOptional()
  @IsIn(Object.values(ENUM_VEHICLE_MODEL_TYPE))
  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
    description:
      'Phân loại kiểu dáng của xe (unknown/scooter/manual/clutch/electric)',
    required: false,
    enum: ENUM_VEHICLE_MODEL_TYPE,
    default: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
  })
  type?: ENUM_VEHICLE_MODEL_TYPE;

  @IsOptional()
  @IsIn(Object.values(ENUM_VEHICLE_MODEL_FUEL_TYPE))
  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
    description:
      'Phân loại nhiên liệu của xe (unknown/gasoline/hybrid/electric)',
    required: false,
    enum: ENUM_VEHICLE_MODEL_FUEL_TYPE,
    default: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
  })
  fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;

  @ApiProperty({
    example: 2020,
    description: 'Năm bắt đầu sản xuất/phân phối',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  yearStart?: number;

  @ApiProperty({
    example: 2020,
    description: 'Năm ngừng sản xuất/phân phối',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  yearEnd?: number;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleBrand: string;
}
