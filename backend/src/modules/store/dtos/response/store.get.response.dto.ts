import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STORE_STATUS } from '../../enums/store.enum';

export class StoreGetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  workHours: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({
    required: true,
    example: ENUM_STORE_STATUS.ACTIVE,
    enum: () => ENUM_STORE_STATUS,
  })
  status: ENUM_STORE_STATUS;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
