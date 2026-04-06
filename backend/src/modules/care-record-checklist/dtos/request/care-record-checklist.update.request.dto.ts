import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CareRecordChecklistCreateRequestDto } from './care-record-checklist.create.request.dto';

export class CareRecordChecklistUpdateRequestDto extends PartialType(
  CareRecordChecklistCreateRequestDto
) {
  @ApiProperty({
    example: [
      '9d78e9f8-1942-4aed-9963-0001e7e5efd9',
      '0fca60d0-46a2-4dbd-a590-160d748ea1fb',
    ],
    description: 'Danh sách phụ tùng đề xuất',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  parts: string[];
}
