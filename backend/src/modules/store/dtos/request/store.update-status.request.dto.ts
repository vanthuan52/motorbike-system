import { ApiProperty } from '@nestjs/swagger';
import { EnumStoreStatus } from '../../enums/store.enum';
import { IsEnum } from 'class-validator';

export class StoreUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumStoreStatus.active,
    enum: EnumStoreStatus,
  })
  @IsEnum(EnumStoreStatus)
  status: EnumStoreStatus;
}
