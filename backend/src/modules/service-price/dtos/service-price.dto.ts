import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';

export class ServicePriceDto extends DatabaseDto {
  @ApiProperty({
    example: 150000,
    description: 'Giá tiền Việt Nam',
  })
  @Expose()
  price: number;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dòng xe',
  })
  @Expose()
  vehicleModel: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dịch vụ xe máy',
  })
  @Expose()
  vehicleService: string;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày bắt đầu có hiệu lực',
  })
  @Expose()
  dateStart: Date;

  @ApiPropertyOptional({
    example: '2025/07/03',
    description: 'Ngày kết thúc hiệu lực',
  })
  @Expose()
  dateEnd?: Date;
}
