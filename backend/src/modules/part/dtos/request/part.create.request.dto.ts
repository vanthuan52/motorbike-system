import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ENUM_PART_STATUS } from '../../enums/part.enum';

export class PartCreateRequestDto {
  @ApiProperty({
    example: 'Lọc gió k&n',
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
    example: 'LG020016',
    description: 'Code loại phụ tùng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    example: '7b51301a-09ca-4846-8063-4b6fe88e5e35',
    description: 'Hãng xe',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  branch: string;

  @ApiProperty({
    example: '7b51301a-09ca-4846-8063-4b6fe88e5e35',
    description: 'Loại phụ tùng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type: string;

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
  @IsIn(Object.values(ENUM_PART_STATUS))
  @ApiProperty({
    example: ENUM_PART_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: ENUM_PART_STATUS,
    default: ENUM_PART_STATUS.ACTIVE,
  })
  status?: ENUM_PART_STATUS;
}
