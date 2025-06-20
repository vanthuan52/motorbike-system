import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ENUM_CANDIDATE_STATUS } from '../../enums/candidate.enum';

export class CandidateUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_CANDIDATE_STATUS.HIRED,
    enum: ENUM_CANDIDATE_STATUS,
  })
  @IsEnum(ENUM_CANDIDATE_STATUS)
  status: ENUM_CANDIDATE_STATUS;
}
