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
import { ENUM_USER_STATUS, ENUM_USER_ROLE } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen', description: 'First name' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Van A', description: 'Last name' })
  @IsString()
  @MaxLength(100)
  lastName: string;

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

  @ApiProperty({ example: ENUM_USER_ROLE.USER, enum: ENUM_USER_ROLE })
  @IsOptional()
  @IsEnum(ENUM_USER_ROLE)
  role?: ENUM_USER_ROLE;

  @ApiProperty({ example: ENUM_USER_STATUS.ACTIVE, enum: ENUM_USER_STATUS })
  @IsOptional()
  @IsEnum(ENUM_USER_STATUS)
  status?: ENUM_USER_STATUS;

  @ApiProperty({ example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212' })
  @IsOptional()
  @IsUUID()
  createBy?: string;

  @ApiProperty({ example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212' })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}
