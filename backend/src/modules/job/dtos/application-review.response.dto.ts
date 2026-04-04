import { ApiProperty } from '@nestjs/swagger';

export class ApplicationReviewResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  user: string;

  @ApiProperty({ type: String })
  jobApplication: string;

  @ApiProperty({ type: String })
  feedback: string;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày tạo',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}
