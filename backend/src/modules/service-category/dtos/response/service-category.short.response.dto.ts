import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ServiceCategoryDto } from '../service-category.dto';

export class ServiceCategoryShortResponseDto extends OmitType(
  ServiceCategoryDto,
  ['createdAt', 'updatedAt']
) {
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
