import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumPartStatus } from '../../enums/part.enum';

export class PartUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumPartStatus.active,
    enum: EnumPartStatus,
  })
  @IsEnum(EnumPartStatus)
  @IsNotEmpty()
  status: EnumPartStatus;
}
