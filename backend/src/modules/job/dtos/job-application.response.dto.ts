import { ApiProperty } from '@nestjs/swagger';
import { ENUM_JOB_APPLICATION_STATUS } from '../enums/job-application.enum';

export class JobApplicationResponseDto {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: String, format: 'date-time' })
  appliedAt: Date;

  @ApiProperty({
    example: ENUM_JOB_APPLICATION_STATUS.NEW,
    enum: () => ENUM_JOB_APPLICATION_STATUS,
    description: 'Trạng thái hồ sơ',
  })
  status: ENUM_JOB_APPLICATION_STATUS;

  @ApiProperty({ type: String })
  job: string;

  @ApiProperty({ example: 'd8c8fca1-...', required: false, type: String })
  createdBy?: string;

  @ApiProperty({ example: 'd8c8fca1-...', required: false, type: String })
  updatedBy?: string;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày tạo',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày cập nhật',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;

  constructor(partial: Partial<JobApplicationResponseDto>) {
    Object.assign(this, partial);
  }
}
