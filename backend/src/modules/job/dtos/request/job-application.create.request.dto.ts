import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ENUM_JOB_APPLICATION_STATUS } from '../../enums/job-application.enum';

export class JobApplicationUserCreateRequestDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên ứng viên',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email ứng viên',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại ứng viên',
  })
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({
    example: '2025-06-20',
    description: 'Ngày nộp hồ sơ (ISO Date)',
  })
  @IsDateString()
  appliedAt: Date;

  @ApiProperty({
    example: ENUM_JOB_APPLICATION_STATUS.NEW,
    enum: () => ENUM_JOB_APPLICATION_STATUS,
    description: 'Trạng thái hồ sơ',
  })
  @IsEnum(ENUM_JOB_APPLICATION_STATUS)
  status: ENUM_JOB_APPLICATION_STATUS;

  @ApiProperty({
    example: '665a7f0f8e4d1bcd9b4fd7a2',
    description: 'ID tin tuyển dụng',
  })
  @IsString()
  job: string;

  @ApiProperty({
    example: '3 năm làm kỹ sư bảo trì tại Honda',
    description: 'Kinh nghiệm làm việc',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  experience?: string;

  @ApiProperty({
    example: 'Cử nhân kỹ thuật cơ khí - ĐH Bách Khoa',
    description: 'Trình độ học vấn',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  education?: string;

  @ApiProperty({
    example: 'https://yourcdn.com/cv/nguyenvana.pdf',
    description: 'Đường dẫn tới file CV',
    required: false,
  })
  @IsOptional()
  @IsString()
  cv?: string;
}
