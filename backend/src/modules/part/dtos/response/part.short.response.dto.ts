import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { PartListResponseDto } from './part.list.response.dto';
import { Exclude } from 'class-transformer';
import { ENUM_PART_STATUS } from '../../enums/part.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';

export class PartShortResponseDto extends OmitType(PartListResponseDto, [
  'partType',
  'vehicleBrand',
  'status',
  'photo',
  'createdAt',
  'updatedAt',
]) {
  @ApiHideProperty()
  @Exclude()
  partType: string;

  @ApiHideProperty()
  @Exclude()
  vehicleBrand: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_PART_STATUS;

  @ApiHideProperty()
  @Exclude()
  photo?: AwsS3ResponseDto;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
