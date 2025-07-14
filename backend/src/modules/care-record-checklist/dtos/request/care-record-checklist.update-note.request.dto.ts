import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CareRecordChecklistUpdateNoteRequestDto {
  @ApiProperty({
    example: 'Ghi chú',
    description: 'Ghi chú',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  note: string;
}
