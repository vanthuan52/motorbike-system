import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnumPartTypeStatus } from '../../enums/part-type.enum';

export class PartTypeUpdateStatusRequestDto {
  @ApiProperty({
    example: EnumPartTypeStatus.active,
    enum: EnumPartTypeStatus,
  })
  @IsEnum(EnumPartTypeStatus)
  status: EnumPartTypeStatus;
}
