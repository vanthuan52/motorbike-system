import { ApiProperty } from '@nestjs/swagger';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../enums/hiring.enum';

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
    enum: ENUM_HIRING_TYPE,
  })
  jobType: ENUM_HIRING_TYPE;

  @ApiProperty({
    required: true,
    enum: ENUM_HIRING_STATUS,
  })
  status: ENUM_HIRING_STATUS;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
