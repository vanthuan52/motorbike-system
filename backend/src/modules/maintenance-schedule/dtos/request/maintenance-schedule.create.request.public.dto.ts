import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
  IsUUID,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../../enums/maintenance-schedule.enum';

export class MaintenanceScheduleCreateRequestPublicDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customer: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  phone: string;

  @ApiProperty({
    example: '261de7c3-15a1-45ae-b8bb-b7cf180bc5e2',
    description: 'Id Hãng xe',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  vehicleBrand: string;

  @ApiProperty({
    example: '261de7c3-15a1-45ae-b8bb-b7cf180bc5e2',
    description: 'Id Tên xe',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  vehicleModel: string;

  @ApiProperty({
    example: '59A1-12345',
    description: 'Biển số xe',
    required: true,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  vehicleNumber: string;

  @ApiProperty({
    example: '2024-07-10',
    description: 'Ngày đặt lịch (ISO date string)',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  scheduleDate: string;

  @ApiProperty({
    example: '14:00-16:00',
    description: 'Giờ đặt lịch',
    required: true,
  })
  @IsNotEmpty()
  timeSlot: string;

  @ApiProperty({
    example: ['261de7c3-15a1-45ae-b8bb-b7cf180bc5e2'],
    description: 'Danh sách ID gói dịch vụ',
    required: true,
    isArray: true,
    type: String,
  })
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  serviceCategory: string[];

  @ApiProperty({
    example: '123 Đường Lớn, Quận 1, TP.HCM',
    description: 'Địa chỉ nhận xe hoặc địa chỉ cửa hàng',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty({
    example: 'Xe có tiếng kêu lạ',
    description: 'Ghi chú',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
