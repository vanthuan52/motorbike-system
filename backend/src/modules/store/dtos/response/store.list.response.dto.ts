import { ApiProperty } from '@nestjs/swagger';
import { StoreGetResponseDto } from './store.get.response.dto';

export class StoreListResponseDto {
  @ApiProperty({ type: [StoreGetResponseDto] })
  items: StoreGetResponseDto[];

  @ApiProperty()
  total: number;
}
