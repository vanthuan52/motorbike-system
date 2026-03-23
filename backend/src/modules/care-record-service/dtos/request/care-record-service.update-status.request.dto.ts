import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumCareRecordServiceStatus } from '../../enums/care-record-service.enum';

export class CareRecordServiceUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumCareRecordServiceStatus.pending,
    enum: EnumCareRecordServiceStatus,
  })
  @IsEnum(EnumCareRecordServiceStatus)
  @IsNotEmpty()
  status: EnumCareRecordServiceStatus;
}
