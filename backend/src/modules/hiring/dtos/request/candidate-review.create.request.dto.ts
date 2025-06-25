import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CandidateReviewAdminCreateRequestDto {
  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'User ID',
  })
  @IsUUID()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'Candidate ID',
  })
  @IsUUID()
  @IsNotEmpty()
  candidate: string;

  @ApiProperty({
    example: 'Tốt',
    description: 'Feedback',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  feedback: string;
}
