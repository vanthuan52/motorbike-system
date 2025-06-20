import { ApiProperty } from '@nestjs/swagger';
import { CandidateGetResponseDto } from './candidate.get.response.dto';

export class CandidateListResponseDto {
  @ApiProperty({ type: [CandidateGetResponseDto] })
  items: CandidateGetResponseDto[];

  @ApiProperty()
  total: number;
}
