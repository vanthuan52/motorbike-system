import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_SERVICE_PRICE_STATUS } from '../../enums/service-price.enum';

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

export class ModelServicePriceGetResponseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID giá dịch vụ',
    required: true,
  })
  servicePriceId: string;

  @ApiProperty({
    example: '150000',
    description: 'Giá tiền Việt Nam',
    required: true,
  })
  price: number | null;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Id dòng xe',
    required: true,
  })
  vehicleModelId: string;

  @ApiProperty({
    example: 'Yamaha Exciter',
    description: 'Tên dòng xe',
    required: true,
  })
  vehicleModelName: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Id dịch vụ',
    required: true,
  })
  vehicleServiceId: string;

  @ApiProperty({
    example: 'Bảo dưỡng an toàn',
    description: 'Tên dịch vụ',
    required: false,
  })
  vehicleServiceName: string;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày bắt đầu có hiệu lực',
    required: true,
  })
  dateStart: Date | null;

  @ApiProperty({
    example: '2025/08/03',
    description: 'Ngày kết thúc hiệu lực',
    required: false,
  })
  dateEnd: Date | null;

  @ApiProperty({
    required: true,
    example: ENUM_SERVICE_PRICE_STATUS.ACTIVE,
    enum: () => ENUM_SERVICE_PRICE_STATUS,
  })
  status: ENUM_SERVICE_PRICE_STATUS;
}
