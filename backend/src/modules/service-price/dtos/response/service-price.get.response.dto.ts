import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class ServicePriceGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: '150000',
    description: 'Giá tiền Việt Nam',
    required: true,
  })
  price: number;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dòng xe',
    required: true,
  })
  vehicleModel: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dịch vụ xe máy',
    required: true,
  })
  vehicleService: string;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày bắt đầu có hiệu lực',
    required: true,
  })
  dateStart: Date;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày kết thúc hiệu lực',
    required: false,
  })
  dateEnd: Date | null;
}
