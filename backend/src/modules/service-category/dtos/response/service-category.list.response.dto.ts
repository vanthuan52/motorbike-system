import { ApiProperty } from '@nestjs/swagger';
import { ServiceCategoryGetResponseDto } from './service-category.get.response.dto';

export class ServiceCategoryListResponseDto {
  @ApiProperty({ type: [ServiceCategoryGetResponseDto] })
  items: ServiceCategoryGetResponseDto[];

  @ApiProperty()
  total: number;
}
