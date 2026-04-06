import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AppointmentCreateRequestDto } from './appointment.create.request.dto';

export class AppointmentBookRequestDto extends OmitType(
  AppointmentCreateRequestDto,
  ['licensePlateNumber', 'customerRequests', 'status'] as const
) {
  @ApiProperty({
    example: '59A1-12345',
    description: 'Biển số xe',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlateNumber: string;
}
