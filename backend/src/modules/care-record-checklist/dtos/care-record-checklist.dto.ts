import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
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
    example: EnumCareRecordChecklistStatus.pending,
    enum: EnumCareRecordChecklistStatus,
  })
  @Expose()
  status: EnumCareRecordChecklistStatus;

  @ApiProperty({
    description: 'Trạng thái kết quả của hạng mục công việc',
    example: EnumCareRecordChecklistResult.unchecked,
    enum: EnumCareRecordChecklistResult,
  })
  @Expose()
  result: EnumCareRecordChecklistResult;

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
