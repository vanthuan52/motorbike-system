import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';

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
  order?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái',
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    enum: ENUM_SERVICE_CATEGORY_STATUS,
  })
  @Expose()
  status?: ENUM_SERVICE_CATEGORY_STATUS;
}
