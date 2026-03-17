import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';

export class CareRecordDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID lịch hẹn',
    required: true,
  })
  @Expose()
  appointment: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID xe của khách hàng',
    required: true,
  })
  @Expose()
  userVehicle: string;

  @ApiPropertyOptional({
    example: 'Honda Wave Alpha',
    description: 'Tên model xe',
  })
  @Expose()
  vehicleModelName?: string;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên phụ trách',
  })
  @Expose()
  technician?: string;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID cửa hàng',
  })
  @Expose()
  store?: string;

  @ApiPropertyOptional({
    example: faker.date.recent(),
    description: 'Thời gian tiếp nhận xe',
  })
  @Expose()
  receivedAt?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Xác nhận thông tin từ khách hàng',
  })
  @Expose()
  confirmedByOwner?: boolean;

  @ApiPropertyOptional({
    example: faker.date.recent(),
    description: 'Thời gian bàn giao xe',
  })
  @Expose()
  handoverTime?: Date;

  @ApiProperty({
    description: 'Trạng thái chăm sóc',
    example: ENUM_CARE_RECORD_STATUS.PENDING,
    enum: ENUM_CARE_RECORD_STATUS,
  })
  @Expose()
  status: ENUM_CARE_RECORD_STATUS;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: ENUM_PAYMENT_STATUS.UNPAID,
    enum: ENUM_PAYMENT_STATUS,
  })
  @Expose()
  paymentStatus: ENUM_PAYMENT_STATUS;

  @ApiPropertyOptional({
    example: 250000,
    description: 'Tổng giá tiền',
  })
  @Expose()
  totalCost?: number;
}
