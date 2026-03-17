import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';

export class AppointmentDto extends DatabaseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 200,
    description: 'Customer name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    maxLength: 20,
    description: 'Customer phone',
  })
  @Expose()
  phone: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User ID (if registered)',
  })
  @Expose()
  user?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User vehicle ID',
  })
  @Expose()
  userVehicle?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Vehicle model ID',
  })
  @Expose()
  vehicleModel: string;

  @ApiProperty({
    type: [String],
    required: true,
    description: 'Vehicle service IDs',
  })
  @Expose()
  vehicleServices: string[];

  @ApiPropertyOptional({
    type: String,
    maxLength: 20,
    description: 'License plate number',
  })
  @Expose()
  licensePlateNumber?: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 255,
    description: 'Address',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Customer requests',
  })
  @Expose()
  customerRequests?: string[];

  @ApiPropertyOptional({
    type: String,
    maxLength: 500,
    description: 'Note',
  })
  @Expose()
  note?: string;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'Appointment date',
  })
  @Expose()
  appointmentDate: Date;

  @ApiProperty({
    enum: ENUM_APPOINTMENT_STATUS,
    required: true,
    description: 'Appointment status',
    example: ENUM_APPOINTMENT_STATUS.PENDING,
  })
  @Expose()
  status: ENUM_APPOINTMENT_STATUS;
}
