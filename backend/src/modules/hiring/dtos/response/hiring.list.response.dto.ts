import { ApiProperty } from '@nestjs/swagger';
import { HiringGetResponseDto } from './hiring.get.response.dto';

export class HiringListResponseDto {
  @ApiProperty({ type: [HiringGetResponseDto] })
  items: HiringGetResponseDto[];

  @ApiProperty()
  total: number;
}
