import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumJobStatus } from '../../enums/job.enum';

export class JobUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumJobStatus.published,
    enum: EnumJobStatus,
  })
  @IsEnum(EnumJobStatus)
  status: EnumJobStatus;
}
