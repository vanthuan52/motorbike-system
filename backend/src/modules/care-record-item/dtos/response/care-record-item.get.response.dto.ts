import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
  ENUM_CARE_RECORD_ITEM_SOURCE,
} from '../../enums/care-record-item.enum';

export class CareRecordItemGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID dịch vụ',
    required: true,
  })
  vehicleService: string;

  @ApiProperty({
    required: true,
    description: 'Xuất phát từ đâu',
    example: ENUM_CARE_RECORD_ITEM_SOURCE.ADDITIONAL,
    enum: () => ENUM_CARE_RECORD_ITEM_SOURCE,
  })
  source: ENUM_CARE_RECORD_ITEM_SOURCE;

  @ApiProperty({
    required: true,
    description: 'Xuất phát từ đâu',
    example: ENUM_CARE_RECORD_ITEM_ITEM_TYPE.SERVICE,
    enum: () => ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
  })
  itemType: ENUM_CARE_RECORD_ITEM_ITEM_TYPE;

  @ApiProperty({
    example: 'Tên',
    description: 'Tên',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID phụ tùng',
    required: false,
  })
  part: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng',
    required: true,
  })
  quantity: number;

  @ApiProperty({
    example: 200000,
    description: 'Giá tiền',
    required: true,
  })
  unitPrice: number;

  @ApiProperty({
    example: 200000,
    description: 'Thành tiền',
    required: true,
  })
  totalPrice: number;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID khách hàng',
    required: true,
  })
  technician: string;

  @ApiProperty({
    example: true,
    description: 'Đồng ý bởi khách hàng',
    required: false,
  })
  approvedByOwner: boolean;

  @ApiProperty({
    example: 'Ghi chú',
    description: 'Ghi chú',
    required: false,
  })
  note?: string;
}
