import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ENUM_APPOINTMENT_STATUS } from '../../enums/appointment.enum';

export class AppointmentCreateRequestDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Số điện thoại',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    example: 'd426d0eb-e654-40c8-9fb7-6671b6cf1382',
    description: 'ID người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({
    example: 'd426d0eb-e654-40c8-9fb7-6671b6cf1382',
    description: 'ID xe của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  userVehicle?: string;

  @ApiProperty({
    example: '61384a81-4425-4b33-84a5-691af292171c',
    description: 'ID model xe',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  vehicleModel: string;

  @ApiProperty({
    example: [
      '9d78e9f8-1942-4aed-9963-0001e7e5efd9',
      '0fca60d0-46a2-4dbd-a590-160d748ea1fb',
    ],
    description: 'Danh sách dịch vụ',
    type: String,
  })
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  vehicleServices: string[];

  @ApiProperty({
    example: '59A1-12345',
    description: 'Biển số xe',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  licensePlateNumber?: string;

  @ApiProperty({
    example: '123 Đường Lớn, Quận 1, TP.HCM',
    description: 'Địa chỉ',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    example: ['Fix lỗi rè đầu đèn', 'Fix ABC'],
    description: 'Danh sách yêu cầu của khách',
    type: String,
  })
  @IsOptional()
  @IsArray()
  customerRequests: string[];

  @ApiProperty({
    example: 'Xe bị rung đầu',
    description: 'Ghi chú',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    example: '2024-07-14T08:00:00.000Z',
    description: 'Ngày đặt lịch (ISO date)',
  })
  @IsNotEmpty()
  @IsDateString()
  appointmentDate: Date;

  @ApiProperty({
    example: ENUM_APPOINTMENT_STATUS.PENDING,
    description: 'Trạng thái',
    required: false,
    enum: ENUM_APPOINTMENT_STATUS,
    default: ENUM_APPOINTMENT_STATUS.PENDING,
  })
  @IsOptional()
  @IsString()
  status?: ENUM_APPOINTMENT_STATUS;
}
