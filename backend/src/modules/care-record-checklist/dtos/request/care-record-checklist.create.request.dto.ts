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
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../../enums/care-record-checklist.enum';

export class CareRecordChecklistCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID công việc',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  serviceChecklist: string;

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
  wearPercentage: number;

  @IsOptional()
  @IsIn(Object.values(ENUM_CARE_RECORD_CHECKLIST_STATUS))
  @ApiProperty({
    example: ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED,
    description: 'Trạng thái của mục công việc',
    required: false,
    enum: ENUM_CARE_RECORD_CHECKLIST_STATUS,
    default: ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED,
  })
  status?: ENUM_CARE_RECORD_CHECKLIST_STATUS;

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
