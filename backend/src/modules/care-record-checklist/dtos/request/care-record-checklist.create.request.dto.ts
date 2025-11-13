import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsIn,
  IsString,
} from 'class-validator';
import {
  ENUM_CARE_RECORD_CHECKLIST_RESULT,
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
} from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID Care Record Service',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careRecordService: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID công việc',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  serviceChecklist?: string;

  @ApiProperty({
    example: 'Tên công việc',
    description: 'Tên công việc (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Some notes',
    description: 'Some notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    example: 90,
    description: 'Mức độ hao mòn',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  wearPercentage?: number;

  @IsOptional()
  @IsIn(Object.values(ENUM_CARE_RECORD_CHECKLIST_STATUS))
  @ApiProperty({
    example: ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING,
    description: 'Trạng thái của mục công việc',
    required: false,
    enum: ENUM_CARE_RECORD_CHECKLIST_STATUS,
    default: ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING,
  })
  status?: ENUM_CARE_RECORD_CHECKLIST_STATUS;

  @IsOptional()
  @IsIn(Object.values(ENUM_CARE_RECORD_CHECKLIST_RESULT))
  @ApiProperty({
    example: ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED,
    description: 'Kết quả của mục công việc',
    required: false,
    enum: ENUM_CARE_RECORD_CHECKLIST_RESULT,
    default: ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED,
  })
  result?: ENUM_CARE_RECORD_CHECKLIST_RESULT;

  @ApiProperty({
    example: faker.image.url(),
    description: 'Ảnh chụp',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageBefore?: string;

  @ApiProperty({
    example: faker.image.url(),
    description: 'Ảnh chụp',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageAfter?: string;
}
