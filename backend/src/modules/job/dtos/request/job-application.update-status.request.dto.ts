import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_JOB_APPLICATION_STATUS } from '../../enums/job-application.enum';

export class JobApplicationUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_JOB_APPLICATION_STATUS.HIRED,
    enum: ENUM_JOB_APPLICATION_STATUS,
  })
  @IsEnum(ENUM_JOB_APPLICATION_STATUS)
  status: ENUM_JOB_APPLICATION_STATUS;
}
