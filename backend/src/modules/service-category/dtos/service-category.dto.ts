import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ServiceCategoryDto {
  @ApiProperty({
    type: String,
    example: 'serviceCategoryId1',
  })
  @IsNotEmpty()
  id: string;
}
