import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PartTypeGetResponseDto } from './part-type.get.response.dto';

export class PartTypeShortResponseDto extends OmitType(PartTypeGetResponseDto, [
  'createdAt',
  'updatedAt',
]) {
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
