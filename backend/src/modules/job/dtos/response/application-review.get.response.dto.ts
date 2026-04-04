import { ApiProperty } from '@nestjs/swagger';

export class ApplicationReviewGetResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  jobApplication: string;

  @ApiProperty({ type: String })
  feedback: string;
}
