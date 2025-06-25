import { ApiProperty } from '@nestjs/swagger';
import { CandidateReviewGetResponseDto } from './candidate-review.get.response.dto';

export class CandidateReviewListResponseDto {
  @ApiProperty({ type: [CandidateReviewGetResponseDto] })
  items: CandidateReviewGetResponseDto[];

  @ApiProperty()
  total: number;
}
