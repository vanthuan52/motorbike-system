import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../../enums/maintenance-schedule.enum';

export class MaintenanceScheduleUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_MAINTENANCE_SCHEDULE_STATUS.PENDING,
    enum: ENUM_MAINTENANCE_SCHEDULE_STATUS,
  })
  @IsEnum(ENUM_MAINTENANCE_SCHEDULE_STATUS)
  @IsNotEmpty()
  status: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}
