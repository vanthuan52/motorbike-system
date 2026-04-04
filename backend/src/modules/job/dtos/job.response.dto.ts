import { ApiProperty } from '@nestjs/swagger';
import { EnumJobStatus, EnumJobType } from '../enums/job.enum';

export class JobResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [String] })
  requirements: string[];

  @ApiProperty()
  location: string;

  @ApiProperty()
  salaryRange: string;

  @ApiProperty({ type: Date })
  applicationDeadline: Date;

  @ApiProperty()
  category: string;

  @ApiProperty({
    required: true,
    enum: EnumJobType,
  })
  jobType: EnumJobType;

  @ApiProperty({
    required: true,
    enum: EnumJobStatus,
  })
  status: EnumJobStatus;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
