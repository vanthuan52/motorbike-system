import { ApiProperty } from '@nestjs/swagger';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../../enums/service-category.enum';

export class ServiceCategoryGetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: '0' })
  order?: string;

  @ApiProperty({
    required: true,
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    enum: () => ENUM_SERVICE_CATEGORY_STATUS,
  })
  status: ENUM_SERVICE_CATEGORY_STATUS;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
