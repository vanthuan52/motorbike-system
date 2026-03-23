import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
  IsUUID,
} from 'class-validator';
import { EnumPartStatus } from '../../enums/part.enum';

export class PartCreateRequestDto {
  @ApiProperty({
    example: 'Lọc gió k&n',
    description: 'Tên phụ tùng',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'loc-gio-123',
    description: 'Mã định danh hoặc slug của phụ tùng',
    required: true,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @ApiProperty({
    example: '0',
    description: 'Thứ tự sắp xếp khi hiển thị các dịch vụ',
    required: false,
    default: '0',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Hãng xe',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleBrand: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Loại phụ tùng',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  partType: string;

  @ApiProperty({
    example: 'Phụ tùng giúp lọc không khí trước khi vào động cơ.',
    description: 'Mô tả chi tiết (có thể bỏ trống)',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(Object.values(EnumPartStatus))
  @ApiProperty({
    example: EnumPartStatus.active,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: EnumPartStatus,
    default: EnumPartStatus.active,
  })
  status?: EnumPartStatus;
}
