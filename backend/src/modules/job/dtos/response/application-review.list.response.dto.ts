import { ApiProperty } from '@nestjs/swagger';
import { ApplicationReviewGetResponseDto } from './application-review.get.response.dto';

export class ApplicationReviewListResponseDto {
  @ApiProperty({ type: [ApplicationReviewGetResponseDto] })
  items: ApplicationReviewGetResponseDto[];

  @ApiProperty()
  total: number;
}
