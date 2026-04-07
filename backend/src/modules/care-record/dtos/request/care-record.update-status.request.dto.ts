import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../../enums/care-record.enum';

export class CareRecordUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumCareRecordStatus.pending,
    enum: EnumCareRecordStatus,
  })
  @IsEnum(EnumCareRecordStatus)
  @IsNotEmpty()
  status: EnumCareRecordStatus;
}

export class CareRecordUpdatePaymentStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumPaymentStatus.unpaid,
    enum: EnumPaymentStatus,
  })
  @IsEnum(EnumPaymentStatus)
  @IsNotEmpty()
  paymentStatus: EnumPaymentStatus;
}
