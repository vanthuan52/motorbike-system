import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  EnumCareRecordItemType,
  EnumCareRecordItemSource,
} from '../enums/care-record-item.enum';

export class CareRecordItemDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
  })
  @Expose()
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID dịch vụ',
  })
  @Expose()
  vehicleService: string;

  @ApiProperty({
    description: 'Xuất phát từ đâu',
    example: EnumCareRecordItemSource.additional,
    enum: EnumCareRecordItemSource,
  })
  @Expose()
  source: EnumCareRecordItemSource;

  @ApiProperty({
    description: 'Loại item',
    example: EnumCareRecordItemType.service,
    enum: EnumCareRecordItemType,
  })
  @Expose()
  itemType: EnumCareRecordItemType;

  @ApiProperty({
    example: 'Tên',
    description: 'Tên',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID phụ tùng',
  })
  @Expose()
  part?: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng',
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    example: 200000,
    description: 'Giá tiền',
  })
  @Expose()
  unitPrice: number;

  @ApiProperty({
    example: 400000,
    description: 'Thành tiền',
  })
  @Expose()
  totalPrice: number;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên',
  })
  @Expose()
  technician?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Đồng ý bởi khách hàng',
  })
  @Expose()
  approvedByOwner?: boolean;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú',
  })
  @Expose()
  note?: string;
}
