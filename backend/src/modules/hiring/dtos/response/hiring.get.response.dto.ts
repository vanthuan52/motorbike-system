import { ApiProperty } from '@nestjs/swagger';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../../enums/hiring.enum';

export class HiringGetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  requirements: object[];

  @ApiProperty()
  location: string;

  @ApiProperty()
  salary_range: string;

  @ApiProperty()
  application_deadline: string;

  @ApiProperty()
  category: string;

  @ApiProperty({
    required: true,
    example: ENUM_HIRING_TYPE.FULL_TIME,
    enum: () => ENUM_HIRING_TYPE,
  })
  job_type: ENUM_HIRING_TYPE;

  @ApiProperty({
    required: true,
    example: ENUM_HIRING_STATUS.DRAFT,
    enum: () => ENUM_HIRING_STATUS,
  })
  status: ENUM_HIRING_STATUS;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
