import { ApiProperty } from '@nestjs/swagger';
import { PartTypeGetResponseDto } from './part-type.get.response.dto';

export class PartTypeListResponseDto {
  @ApiProperty({ type: [PartTypeGetResponseDto] })
  items: PartTypeGetResponseDto[];

  @ApiProperty()
  total: number;
}
