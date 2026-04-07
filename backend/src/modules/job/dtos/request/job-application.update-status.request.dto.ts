import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumJobApplicationStatus } from '../../enums/job-application.enum';

export class JobApplicationUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumJobApplicationStatus.hired,
    enum: EnumJobApplicationStatus,
  })
  @IsEnum(EnumJobApplicationStatus)
  status: EnumJobApplicationStatus;
}
