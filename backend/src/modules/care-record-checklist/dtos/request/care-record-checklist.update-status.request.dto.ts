import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED,
    enum: ENUM_CARE_RECORD_CHECKLIST_STATUS,
  })
  @IsEnum(ENUM_CARE_RECORD_CHECKLIST_STATUS)
  @IsNotEmpty()
  status: ENUM_CARE_RECORD_CHECKLIST_STATUS;
}
