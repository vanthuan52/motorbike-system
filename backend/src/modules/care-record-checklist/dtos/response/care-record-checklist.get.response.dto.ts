import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID mục công việc',
    required: true,
  })
  serviceChecklist: string;

  @ApiProperty({
    required: true,
    description: 'Trạng thái hạng mục công việc',
    example: ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED,
    enum: () => ENUM_CARE_RECORD_CHECKLIST_STATUS,
  })
  status?: ENUM_CARE_RECORD_CHECKLIST_STATUS;

  @ApiProperty({
    example: 'Ghi chú',
    description: 'Ghi chú',
    required: false,
  })
  note?: string;

  @ApiProperty({
    example: 95,
    description: 'Mức độ hao mòn (%)',
    required: false,
  })
  wearPercentage?: number;

  @ApiProperty({
    example: faker.image.url(),
    description: 'Anh chụp trước khi kiểm tra',
    required: false,
  })
  imageBefore?: string;

  @ApiProperty({
    example: faker.image.url(),
    description: 'Anh chụp sau khi kiểm tra',
    required: false,
  })
  imageAfter?: string;
}
