import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';

export class ServiceCategoryResponseDto {
  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'Service category ID',
  })
  id: string;

  @ApiProperty({ example: 'Rửa full xe' })
  name: string;

  @ApiProperty({ example: 'rua-full-xe' })
  slug: string;

  @ApiProperty({ example: 'Rửa xe toàn bộ', required: false })
  description?: string;

  @ApiProperty({ example: '0', required: false })
  order?: string;

  @ApiProperty({
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    enum: () => ENUM_SERVICE_CATEGORY_STATUS,
  })
  status: ENUM_SERVICE_CATEGORY_STATUS;

  @ApiProperty({ example: 'https://domain.com/photo.jpg', required: false })
  photo?: string;

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

  constructor(partial: Partial<ServiceCategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
