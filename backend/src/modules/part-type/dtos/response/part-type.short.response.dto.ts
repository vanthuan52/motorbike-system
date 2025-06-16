import { ApiProperty } from '@nestjs/swagger';

export class PartTypeShortResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
