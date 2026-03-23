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
import { EnumHiringStatus, EnumHiringJobType } from '../../enums/hiring.enum';

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
    example: 'tho-sua-xe',
    description: 'Slug',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

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
    example: EnumHiringJobType.fullTime,
    description: 'Loại công việc',
    required: true,
    enum: EnumHiringJobType,
    default: EnumHiringJobType.fullTime,
  })
  @IsIn(Object.values(EnumHiringJobType))
  @IsString()
  jobType: EnumHiringJobType;

  @ApiProperty({
    example: EnumHiringStatus.draft,
    description: 'Trạng thái tuyển dụng',
    required: false,
    enum: EnumHiringStatus,
    default: EnumHiringStatus.draft,
  })
  @IsIn(Object.values(EnumHiringStatus))
  @IsString()
  status: EnumHiringStatus;
}
