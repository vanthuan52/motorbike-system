import { ApiProperty } from '@nestjs/swagger';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../../enums/service-category.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class ServiceCategoryGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Rửa full xe' })
  name: string;

  @ApiProperty({ example: 'rua-full-xe' })
  slug: string;

  @ApiProperty({ example: 'Rửa xe toàn bộ', required: false })
  description?: string;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Thứ tự hiển thị danh mục dịch vụ',
  })
  order?: string;

  @ApiProperty({
    required: true,
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    enum: () => ENUM_SERVICE_CATEGORY_STATUS,
  })
  status: ENUM_SERVICE_CATEGORY_STATUS;
}
