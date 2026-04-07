import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumJobApplicationStatus } from '../../enums/job-application.enum';

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
    example: EnumJobApplicationStatus.new,
    enum: () => EnumJobApplicationStatus,
  })
  @IsEnum(EnumJobApplicationStatus)
  status: EnumJobApplicationStatus;
}
