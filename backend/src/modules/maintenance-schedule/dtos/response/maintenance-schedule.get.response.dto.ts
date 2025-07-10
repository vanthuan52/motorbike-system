import { ApiProperty } from '@nestjs/swagger';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../../enums/maintenance-schedule.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class MaintenanceScheduleGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên khách hàng' })
  customer: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại' })
  phone: string;

  @ApiProperty({ example: 'vehicleBrandId', description: 'Id Hãng xe' })
  vehicleBrand: string;

  @ApiProperty({ example: 'vehicleModelId', description: 'Id Tên xe' })
  vehicleModel: string;

  @ApiProperty({ example: '59A1-12345', description: 'Biển số xe' })
  vehicleNumber: string;

  @ApiProperty({
    example: '2024-07-10',
    description: 'Ngày đặt lịch (ISO date string)',
  })
  scheduleDate: string;

  @ApiProperty({
    example: '2024-07-10T08:00:00.000Z',
    description: 'Giờ đặt lịch (ISO date string)',
  })
  timeSlot: string;

  @ApiProperty({ example: 'serviceCategoryId', description: 'Id gói dịch vụ' })
  serviceCategory: string;

  @ApiProperty({
    example: '123 Đường Lớn, Quận 1, TP.HCM',
    description: 'Địa chỉ nhận xe hoặc địa chỉ cửa hàng',
  })
  address: string;

  @ApiProperty({
    example: 'staffId',
    description: 'Id nhân viên',
    required: false,
  })
  staff?: string;

  @ApiProperty({
    example: 'Xe có tiếng kêu lạ',
    description: 'Ghi chú',
    required: false,
  })
  note?: string;

  @ApiProperty({
    example: ENUM_MAINTENANCE_SCHEDULE_STATUS.ACTIVE,
    description: 'Trạng thái hoạt động (active/inactive)',
    enum: ENUM_MAINTENANCE_SCHEDULE_STATUS,
  })
  status: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}
