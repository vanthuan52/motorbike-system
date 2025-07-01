import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ServiceCategoryGetResponseDto } from './service-category.get.response.dto';

export class ServiceCategoryShortResponseDto extends OmitType(
  ServiceCategoryGetResponseDto,
  ['createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
