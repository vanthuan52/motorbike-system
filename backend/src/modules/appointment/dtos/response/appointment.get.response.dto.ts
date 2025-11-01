import { ApiProperty } from '@nestjs/swagger';
import { ENUM_APPOINTMENT_STATUS } from '../../enums/appointment.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class AppointmentGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: 'userId',
    description: 'ID người dùng',
    required: false,
  })
  user?: string;

  @ApiProperty({
    example: 'userVehicleId',
    description: 'ID xe của người dùng',
    required: false,
  })
  userVehicle?: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên khách hàng' })
  name: string;

  @ApiProperty({ example: '0912345678', description: 'Số điện thoại' })
  phone: string;

  @ApiProperty({ example: 'vehicleModelId', description: 'ID model xe' })
  vehicleModel: string;

  @ApiProperty({
    example: ['serviceId1', 'serviceId2'],
    description: 'Danh sách dịch vụ',
    type: [String],
  })
  vehicleServices: string[];

  @ApiProperty({ example: '59A1-12345', description: 'Biển số xe' })
  licensePlateNumber: string;

  @ApiProperty({
    example: '2024-07-14T08:00:00.000Z',
    description: 'Ngày đặt lịch (ISO date)',
  })
  appointmentDate: string;

  @ApiProperty({
    example: '123 Đường Lớn, Quận 1, TP.HCM',
    description: 'Địa chỉ',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: ['Fix lỗi rè đầu đèn', 'Fix ABC'],
    description: 'Danh sách yêu cầu của khách',
    required: false,
  })
  customerRequests?: string[];

  @ApiProperty({
    example: 'Xe bị rung đầu',
    description: 'Ghi chú',
    required: false,
  })
  note?: string;

  @ApiProperty({
    example: ENUM_APPOINTMENT_STATUS.PENDING,
    description: 'Trạng thái lịch hẹn',
    enum: ENUM_APPOINTMENT_STATUS,
  })
  status: ENUM_APPOINTMENT_STATUS;
}
