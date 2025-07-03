import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServicePriceCreateRequestDto {
  @ApiProperty({
    example: '150000',
    description: 'Giá tiền Việt Nam',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dòng xe',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleModel: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Dịch vụ xe máy',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleService: string;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày bắt đầu có hiệu lực',
    required: true,
  })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dateStart: Date;

  @ApiProperty({
    example: '2025/07/03',
    description: 'Ngày kết thúc hiệu lực',
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  dateEnd: Date | null;
}
