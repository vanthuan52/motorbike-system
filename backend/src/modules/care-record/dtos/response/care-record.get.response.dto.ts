import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../../enums/care-record.enum';

export class CareRecordGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID lịch hẹn',
    required: true,
  })
  appointment: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID xe của khách hàng',
    required: true,
  })
  userVehicle: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên phụ trách',
    required: false,
  })
  technician?: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID cửa hàng',
    required: false,
  })
  store?: string;

  @ApiProperty({
    example: faker.date.recent(),
    description: 'Thời gian tiếp nhận xe',
    required: false,
  })
  receivedAt?: Date;

  @ApiProperty({
    example: true,
    description: 'Xác nhận thông tin từ khách hàng',
    required: false,
  })
  confirmedByOwner?: boolean;

  @ApiProperty({
    example: faker.date.recent(),
    description: 'Thời gian bàn giao xe',
    required: true,
  })
  handoverTime?: Date;

  @ApiProperty({
    required: true,
    description: 'Trạng thái chăm sóc',
    example: ENUM_CARE_RECORD_STATUS.PENDING,
    enum: () => ENUM_CARE_RECORD_STATUS,
  })
  status?: ENUM_CARE_RECORD_STATUS;

  @ApiProperty({
    required: true,
    description: 'Trạng thái thanh toán',
    example: ENUM_PAYMENT_STATUS.UNPAID,
    enum: () => ENUM_PAYMENT_STATUS,
  })
  paymentStatus?: ENUM_PAYMENT_STATUS;

  @ApiProperty({
    example: '250000',
    description: 'Tổng giá tiền',
    required: false,
  })
  totalCost?: number;
}
