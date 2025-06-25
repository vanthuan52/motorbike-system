import { ApiProperty } from '@nestjs/swagger';

export class CandidateReviewGetResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  candidate: string;

  @ApiProperty({ type: String })
  feedback: string;
}
