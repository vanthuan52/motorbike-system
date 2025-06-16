import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PartTypeDto {
  @ApiProperty({
    type: String,
    example: 'partTypeId1',
  })
  @IsNotEmpty()
  id: string;
}
