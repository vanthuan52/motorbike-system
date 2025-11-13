import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_CARE_RECORD_CHECKLIST_RESULT } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistUpdateResultRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED,
    enum: ENUM_CARE_RECORD_CHECKLIST_RESULT,
  })
  @IsEnum(ENUM_CARE_RECORD_CHECKLIST_RESULT)
  @IsNotEmpty()
  result: ENUM_CARE_RECORD_CHECKLIST_RESULT;
}
