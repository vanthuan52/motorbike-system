import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  ENUM_CARE_RECORD_CHECKLIST_RESULT,
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
} from '../enums/care-record-checklist.enum';

export class CareRecordChecklistDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID care record service',
    required: true,
  })
  @Expose()
  careRecordService: string;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID mục công việc',
  })
  @Expose()
  serviceChecklist?: string;

  @ApiPropertyOptional({
    example: 'Tên công việc',
    description: 'Tên công việc',
  })
  @Expose()
  name?: string;

  @ApiProperty({
    description: 'Trạng thái hạng mục công việc',
    example: ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING,
    enum: ENUM_CARE_RECORD_CHECKLIST_STATUS,
  })
  @Expose()
  status: ENUM_CARE_RECORD_CHECKLIST_STATUS;

  @ApiProperty({
    description: 'Trạng thái kết quả của hạng mục công việc',
    example: ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED,
    enum: ENUM_CARE_RECORD_CHECKLIST_RESULT,
  })
  @Expose()
  result: ENUM_CARE_RECORD_CHECKLIST_RESULT;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @Expose()
  note?: string;

  @ApiPropertyOptional({
    example: 95,
    description: 'Mức độ hao mòn (%)',
  })
  @Expose()
  wearPercentage?: number;

  @ApiPropertyOptional({
    example: faker.image.url(),
    description: 'Ảnh chụp trước khi kiểm tra',
  })
  @Expose()
  imageBefore?: string;

  @ApiPropertyOptional({
    example: faker.image.url(),
    description: 'Ảnh chụp sau khi kiểm tra',
  })
  @Expose()
  imageAfter?: string;

  @ApiPropertyOptional({
    example: ['partId1', 'partId2'],
    description: 'Danh sách phụ tùng đề xuất',
    type: [String],
  })
  @Expose()
  parts?: string[];
}
