import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
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
  licensePlateNumber: string;

  @ApiPropertyOptional({
    example: '2021',
    description: 'Đời xe',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  modelYear?: number;

  @ApiPropertyOptional({
    example: 'Đỏ đen',
    description: 'Màu xe',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({
    example: 'GIHEHF5328473289',
    description: 'Số máy xe',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @MaxLength(20)
  engineNumber?: string;

  @ApiPropertyOptional({
    example: 'TIkEHF5328473289',
    description: 'Số khung xe',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @MaxLength(20)
  chassisNumber?: string;

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
