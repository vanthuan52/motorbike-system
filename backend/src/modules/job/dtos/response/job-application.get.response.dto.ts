import { ApiProperty } from '@nestjs/swagger';
import { ENUM_JOB_APPLICATION_STATUS } from '../../enums/job-application.enum';
import { IsEnum } from 'class-validator';

export class JobApplicationGetResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: Date })
  applied_at: Date;

  @ApiProperty({
    required: true,
    example: ENUM_JOB_APPLICATION_STATUS.NEW,
    enum: () => ENUM_JOB_APPLICATION_STATUS,
  })
  @IsEnum(ENUM_JOB_APPLICATION_STATUS)
  status: ENUM_JOB_APPLICATION_STATUS;
}
