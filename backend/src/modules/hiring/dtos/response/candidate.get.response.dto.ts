import { ApiProperty } from '@nestjs/swagger';
import { ENUM_CANDIDATE_STATUS } from '../../enums/candidate.enum';
import { IsEnum } from 'class-validator';

export class CandidateGetResponseDto {
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
    example: ENUM_CANDIDATE_STATUS.NEW,
    enum: () => ENUM_CANDIDATE_STATUS,
  })
  @IsEnum(ENUM_CANDIDATE_STATUS)
  status: ENUM_CANDIDATE_STATUS;
}
