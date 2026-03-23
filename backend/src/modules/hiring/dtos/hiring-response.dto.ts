import { ApiProperty } from '@nestjs/swagger';
import { EnumHiringStatus, EnumHiringJobType } from '../enums/hiring.enum';

export class HiringResponseDto {
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
    enum: EnumHiringJobType,
  })
  jobType: EnumHiringJobType;

  @ApiProperty({
    required: true,
    enum: EnumHiringStatus,
  })
  status: EnumHiringStatus;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
