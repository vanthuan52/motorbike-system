import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STORE_STATUS } from '../../enums/store.enum';
import { IsEnum } from 'class-validator';

export class StoreUpdateStatusRequestDto {
  @ApiProperty({
    example: ENUM_STORE_STATUS.ACTIVE,
    enum: ENUM_STORE_STATUS,
  })
  @IsEnum(ENUM_STORE_STATUS)
  status: ENUM_STORE_STATUS;
}
