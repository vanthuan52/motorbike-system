import { ApiProperty } from '@nestjs/swagger';
import { JobGetResponseDto } from './job.get.response.dto';

export class JobListResponseDto {
  @ApiProperty({ type: [JobGetResponseDto] })
  items: JobGetResponseDto[];

  @ApiProperty()
  total: number;
}
