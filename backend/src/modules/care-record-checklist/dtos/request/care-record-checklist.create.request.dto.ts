import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
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
  @IsIn(Object.values(EnumCareRecordChecklistStatus))
  @ApiProperty({
    example: EnumCareRecordChecklistStatus.pending,
    description: 'Trạng thái của mục công việc',
    required: false,
    enum: EnumCareRecordChecklistStatus,
    default: EnumCareRecordChecklistStatus.pending,
  })
  status?: EnumCareRecordChecklistStatus;

  @IsOptional()
  @IsIn(Object.values(EnumCareRecordChecklistResult))
  @ApiProperty({
    example: EnumCareRecordChecklistResult.unchecked,
    description: 'Kết quả của mục công việc',
    required: false,
    enum: EnumCareRecordChecklistResult,
    default: EnumCareRecordChecklistResult.unchecked,
  })
  result?: EnumCareRecordChecklistResult;

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
