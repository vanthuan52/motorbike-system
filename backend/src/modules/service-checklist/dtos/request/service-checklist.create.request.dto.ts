import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { faker } from '@faker-js/faker';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';

export class ServiceChecklistCreateRequestDto {
  @ApiProperty({
    example: 'Kiểm tra phanh',
    description: 'Tên công việc chuẩn có thể thực hiện trên mọi xe máy',
    required: true,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({
    example: 'kiem-tra-phanh',
    description: 'Mã công việc',
    required: true,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  code: string;

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
    description: 'Thứ tự sắp xếp khi hiển thị các công việc',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  orderBy?: number;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careArea: string;

  @ApiProperty({
    description: 'Danh sách các loại xe mà công việc này áp dụng.',
    required: false,
    enum: EnumVehicleModelType,
    isArray: true,
    default: [], // Mặc định là mảng rỗng (diễn giải là áp dụng cho tất cả hoặc không có giới hạn)
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(Object.values(EnumVehicleModelType), { each: true })
  vehicleType?: EnumVehicleModelType[];
}
