import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../../enums/service-category.enum';

export class ServiceCategoryCreateRequestDto {
  @ApiProperty({
    example: 'Rửa xe',
    description: 'Tên danh mục dịch vụ',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'dich-vu-web',
    description:
      'Chuỗi thân thiện với URL, thường được tạo từ name (ví dụ: "dich-vu-web", "thiet-ke-do-hoa"). Hữu ích cho SEO và URL đẹp.',
    required: true,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

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
    example: '0',
    description: 'Thứ tự sắp xếp khi hiển thị các danh mục',
    required: false,
    default: '0',
  })
  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsIn(Object.values(ENUM_SERVICE_CATEGORY_STATUS))
  @ApiProperty({
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    required: false,
    enum: ENUM_SERVICE_CATEGORY_STATUS,
    default: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
  })
  status?: ENUM_SERVICE_CATEGORY_STATUS;
}
