import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../enums/hiring.enum';

export class HiringResponseDto {
  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'Hiring ID',
  })
  id: string;

  @ApiProperty({
    example: 'Thợ sửa xe máy',
    description: 'Tiêu đề',
  })
  title: string;

  @ApiProperty({
    example: 'tho-sua-xe-may',
    description: 'Slug',
  })
  slug: string;

  @ApiProperty({
    example:
      'Chúng tôi đang tìm kiếm một thợ sửa xe máy có kinh nghiệm để gia nhập đội ngũ của chúng tôi.',
    description: 'Mô tả công việc',
  })
  description: string;

  @ApiProperty({
    example: ['Kinh nghiệm ít nhất 2 năm', 'Có chứng chỉ sửa chữa xe máy'],
    description: 'Yêu cầu công việc',
  })
  requirements: string[];

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Địa điểm làm việc',
  })
  location: string;

  @ApiProperty({
    example: '10.000.000 - 15.000.000 VNĐ',
    description: 'Mức lương',
  })
  salaryRange: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59.999Z',
    description: 'Hạn nộp đơn',
  })
  applicationDeadline: Date;

  @ApiProperty({
    example: 'Công nghệ',
    description: 'Danh mục công việc',
  })
  category: string;

  @ApiProperty({
    example: ENUM_HIRING_TYPE.FULL_TIME,
    enum: ENUM_HIRING_TYPE,
    description: 'Loại hình công việc',
  })
  jobType: ENUM_HIRING_TYPE;

  @ApiProperty({
    example: ENUM_HIRING_STATUS.DRAFT,
    enum: ENUM_HIRING_STATUS,
    description: 'Trạng thái công việc',
  })
  status: ENUM_HIRING_STATUS;

  @ApiProperty({ example: 'd8c8fca1-...', required: false })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiProperty({ example: 'd8c8fca1-...', required: false })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated at',
  })
  updatedAt: Date;

  constructor(partial: Partial<HiringResponseDto>) {
    Object.assign(this, partial);
  }
}
