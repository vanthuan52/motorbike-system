import { ApiProperty } from '@nestjs/swagger';
import { EnumJobStatus, EnumJobType } from '../../enums/job.enum';

export class JobGetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  requirements: object[];

  @ApiProperty()
  location: string;

  @ApiProperty()
  salaryRange: string;

  @ApiProperty()
  applicationDeadline: string;

  @ApiProperty()
  category: string;

  @ApiProperty({
    required: true,
    example: EnumJobType.fullTime,
    enum: () => EnumJobType,
  })
  jobType: EnumJobType;

  @ApiProperty({
    required: true,
    example: EnumJobStatus.draft,
    enum: () => EnumJobStatus,
  })
  status: EnumJobStatus;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
