import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumCareRecordChecklistStatus } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumCareRecordChecklistStatus.pending,
    enum: EnumCareRecordChecklistStatus,
  })
  @IsEnum(EnumCareRecordChecklistStatus)
  @IsNotEmpty()
  status: EnumCareRecordChecklistStatus;
}
