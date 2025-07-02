import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ENUM_PART_TYPE_STATUS } from '../../enums/part-type.enum';

export class PartTypeCreateRequestDto {
  @ApiProperty({
    example: 'Lọc gió',
    description: 'Tên loại phụ tùng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'loc-gio-123',
    description: 'Mã định danh hoặc slug của loại phụ tùng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

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

  @ApiProperty({
    example: '0',
    description: 'Chữ số thể hiện thứ tự hiển thị',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  order?: string;

  @IsOptional()
  @IsIn(Object.values(ENUM_PART_TYPE_STATUS))
  @ApiProperty({
    example: ENUM_PART_TYPE_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: ENUM_PART_TYPE_STATUS,
    default: ENUM_PART_TYPE_STATUS.ACTIVE,
  })
  status?: ENUM_PART_TYPE_STATUS;

  @ApiProperty({
    description: 'Ảnh đại diện loại phụ tùng (có thể để trống)',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
