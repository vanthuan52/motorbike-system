import { ApiProperty } from '@nestjs/swagger';
import { JobApplicationGetResponseDto } from './job-application.get.response.dto';

export class JobApplicationListResponseDto {
  @ApiProperty({ type: [JobApplicationGetResponseDto] })
  items: JobApplicationGetResponseDto[];

  @ApiProperty()
  total: number;
}
