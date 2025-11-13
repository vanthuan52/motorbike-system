import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_CARE_RECORD_SERVICE_STATUS } from '../../enums/care-record-service.enum';

export class CareRecordServiceUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_CARE_RECORD_SERVICE_STATUS.PENDING,
    enum: ENUM_CARE_RECORD_SERVICE_STATUS,
  })
  @IsEnum(ENUM_CARE_RECORD_SERVICE_STATUS)
  @IsNotEmpty()
  status: ENUM_CARE_RECORD_SERVICE_STATUS;
}
