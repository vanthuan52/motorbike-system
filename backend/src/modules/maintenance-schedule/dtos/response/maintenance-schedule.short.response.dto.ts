import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../../enums/maintenance-schedule.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { MaintenanceScheduleListResponseDto } from './maintenance-schedule.list.response.dto';

export class MaintenanceScheduleShortResponseDto extends OmitType(
  MaintenanceScheduleListResponseDto,
  ['serviceCategory', 'status', 'createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  serviceCategory: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_MAINTENANCE_SCHEDULE_STATUS;

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
