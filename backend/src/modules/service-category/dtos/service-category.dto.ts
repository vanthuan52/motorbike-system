import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { EnumServiceCategoryStatus } from '../enums/service-category.enum';

export class ServiceCategoryDto extends DatabaseDto {
  @ApiProperty({
    example: 'Category name',
    description: 'Tên danh mục',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: 'category-slug',
    description: 'Slug danh mục',
  })
  @Expose()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Description',
    description: 'Mô tả',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự',
  })
  @Expose()
  orderBy?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái',
    example: EnumServiceCategoryStatus.active,
    enum: EnumServiceCategoryStatus,
  })
  @Expose()
  status?: EnumServiceCategoryStatus;
}
