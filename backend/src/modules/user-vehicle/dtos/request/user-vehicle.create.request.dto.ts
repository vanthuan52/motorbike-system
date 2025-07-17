import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUUID,
  IsEmpty,
} from 'class-validator';
import { faker } from '@faker-js/faker';

export class UserVehicleCreateRequestDto {
  @ApiProperty({
    example: '59-FA-99999',
    description: 'Biển số xe',
    required: true,
    maxLength: 20,
  })
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty({
    example: 'Đỏ đen',
    description: 'Màu xe',
    required: false,
    maxLength: 20,
  })
  @MaxLength(20)
  color: string;

  @ApiProperty({
    example: 'GIHEHF5328473289',
    description: 'Số máy xe',
    required: false,
    maxLength: 20,
  })
  @MaxLength(20)
  engineNumber: string;

  @ApiProperty({
    example: 'TIkEHF5328473289',
    description: 'Số khung xe',
    required: false,
    maxLength: 20,
  })
  @MaxLength(20)
  chassisNumber: string;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  user: string;

  @ApiProperty({
    example: faker.string.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleModel: string;
}
