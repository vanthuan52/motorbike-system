import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CareRecordChecklistUpdateWearPercentageRequestDto {
  @ApiProperty({
    example: 95,
    description: 'Mức độ hao mòn',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  wearPercentage: number;
}
