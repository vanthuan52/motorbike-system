import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ENUM_USER_STATUS, ENUM_USER_TYPE } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen', description: 'First name' })
  @IsString()
  @MaxLength(100)
  first_name: string;

  @ApiProperty({ example: 'Van A', description: 'Last name' })
  @IsString()
  @MaxLength(100)
  last_name: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  phone?: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({ example: 'encrypted-password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ example: ENUM_USER_TYPE.CUSTOMER, enum: ENUM_USER_TYPE })
  @IsOptional()
  @IsEnum(ENUM_USER_TYPE)
  type?: ENUM_USER_TYPE;

  @ApiProperty({ example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212' })
  @IsOptional()
  @IsUUID()
  ref_id?: string;

  @ApiProperty({ example: ENUM_USER_STATUS.ACTIVE, enum: ENUM_USER_STATUS })
  @IsOptional()
  @IsEnum(ENUM_USER_STATUS)
  status?: ENUM_USER_STATUS;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({ example: '123 Đường ABC, Phường XYZ', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({ example: 'Phường 1', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ward?: string;

  @ApiProperty({ example: 'Quận 3', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  @ApiProperty({ example: 'TP.HCM', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;
}
