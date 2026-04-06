import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ENUM_PAYMENT_STATUS } from '../../enums/care-record.enum';

export class CareRecordCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID lịch hẹn',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  appointment: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID xe của khách hàng',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  userVehicle: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên phụ trách',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  technician?: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID cửa hàng',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  store?: string;

  @ApiHideProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  receivedAt?: Date;

  @ApiProperty({
    example: true,
    description: 'Xác nhận thông tin từ khách hàng',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  confirmedByOwner?: boolean;

  @ApiHideProperty()
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  handoverTime?: Date;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(Object.values(ENUM_PAYMENT_STATUS))
  paymentStatus?: ENUM_PAYMENT_STATUS;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  totalCost?: number;
}
