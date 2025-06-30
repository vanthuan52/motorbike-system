import { ApiProperty } from '@nestjs/swagger';

export class ServiceCategoryShortResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
