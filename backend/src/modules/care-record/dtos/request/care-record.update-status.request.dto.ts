import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../../enums/care-record.enum';

export class CareRecordUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_CARE_RECORD_STATUS.PENDING,
    enum: ENUM_CARE_RECORD_STATUS,
  })
  @IsEnum(ENUM_CARE_RECORD_STATUS)
  @IsNotEmpty()
  status: ENUM_CARE_RECORD_STATUS;
}

export class CareRecordUpdatePaymentStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_PAYMENT_STATUS.UNPAID,
    enum: ENUM_PAYMENT_STATUS,
  })
  @IsEnum(ENUM_PAYMENT_STATUS)
  @IsNotEmpty()
  paymentStatus: ENUM_PAYMENT_STATUS;
}
