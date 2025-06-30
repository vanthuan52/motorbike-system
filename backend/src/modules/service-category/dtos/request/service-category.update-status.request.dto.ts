import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../../enums/service-category.enum';

export class ServiceCategoryUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    enum: ENUM_SERVICE_CATEGORY_STATUS,
  })
  @IsEnum(ENUM_SERVICE_CATEGORY_STATUS)
  status: ENUM_SERVICE_CATEGORY_STATUS;
}
