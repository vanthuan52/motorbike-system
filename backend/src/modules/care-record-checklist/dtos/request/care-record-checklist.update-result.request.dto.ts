import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumCareRecordChecklistResult } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistUpdateResultRequestDto {
  @ApiProperty({
    required: true,
    example: EnumCareRecordChecklistResult.unchecked,
    enum: EnumCareRecordChecklistResult,
  })
  @IsEnum(EnumCareRecordChecklistResult)
  @IsNotEmpty()
  result: EnumCareRecordChecklistResult;
}
