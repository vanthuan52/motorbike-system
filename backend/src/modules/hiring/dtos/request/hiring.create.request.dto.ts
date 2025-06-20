import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
  Matches,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../../enums/hiring.enum';

export class HiringCreateRequestDto {
  @ApiProperty({
    example: 'Thợ sửa xe',
    description: 'Tiêu đề',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'Cần tuyển thợ sửa xe có kinh nghiệm.',
    description: 'Mô tả công việc',
    required: true,
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    example: [
      'Có kinh nghiệm ít nhất 2 năm trong ngành sửa chữa xe máy',
      'Sử dụng thành thạo các công cụ sửa chữa',
      'Có khả năng làm việc độc lập và theo nhóm',
    ],
    description: 'Yêu cầu công việc',
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty({
    example: 'Quận 1, TP.HCM',
    description: 'Địa chỉ làm việc',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  location: string;

  @ApiProperty({
    example: '10.000.000 - 15.000.000 VNĐ',
    description: 'Khoảng lương',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  salaryRange: string;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Hạn nộp hồ sơ',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  applicationDeadline: Date;

  @ApiProperty({
    example: 'Kỹ thuật',
    description: 'Danh mục',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    example: ENUM_HIRING_TYPE.FULL_TIME,
    description: 'Loại công việc',
    required: true,
    enum: ENUM_HIRING_TYPE,
    default: ENUM_HIRING_TYPE.FULL_TIME,
  })
  @IsIn(Object.values(ENUM_HIRING_TYPE))
  @IsString()
  jobType: ENUM_HIRING_TYPE;

  @ApiProperty({
    example: ENUM_HIRING_STATUS.DRAFT,
    description: 'Trạng thái tuyển dụng',
    required: false,
    enum: ENUM_HIRING_STATUS,
    default: ENUM_HIRING_STATUS.DRAFT,
  })
  @IsIn(Object.values(ENUM_HIRING_STATUS))
  @IsString()
  status: ENUM_HIRING_STATUS;
}
