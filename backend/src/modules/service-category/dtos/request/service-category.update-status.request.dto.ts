import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumServiceCategoryStatus } from '../../enums/service-category.enum';

export class ServiceCategoryUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumServiceCategoryStatus.active,
    enum: EnumServiceCategoryStatus,
  })
  @IsEnum(EnumServiceCategoryStatus)
  status: EnumServiceCategoryStatus;
}
