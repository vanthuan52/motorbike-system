import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsIn,
  IsString,
} from 'class-validator';
import {
  ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
  ENUM_CARE_RECORD_ITEM_SOURCE,
} from '../../enums/care-record-item.enum';

export class CareRecordItemCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID dịch vụ',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleService: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên phụ trách',
    required: true,
  })
  @IsOptional()
  @IsUUID()
  technician: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID phụ tùng',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  part: string;

  @IsNotEmpty()
  @IsIn(Object.values(ENUM_CARE_RECORD_ITEM_SOURCE))
  @ApiProperty({
    example: ENUM_CARE_RECORD_ITEM_SOURCE.SCHEDULED,
    description: 'Nguồn gốc từ đâu',
    required: true,
    enum: ENUM_CARE_RECORD_ITEM_SOURCE,
  })
  source: ENUM_CARE_RECORD_ITEM_SOURCE;

  @IsNotEmpty()
  @IsIn(Object.values(ENUM_CARE_RECORD_ITEM_ITEM_TYPE))
  @ApiProperty({
    example: ENUM_CARE_RECORD_ITEM_ITEM_TYPE.SERVICE,
    description: 'Thể loại của item',
    required: true,
    enum: ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
  })
  itemType: ENUM_CARE_RECORD_ITEM_ITEM_TYPE;

  @ApiProperty({
    example: '',
    description: 'Tên item',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Số lượng',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 150000,
    description: 'Giá tiền',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiProperty({
    example: true,
    description: 'Xác nhận thông tin từ khách hàng',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  approvedByOwner?: boolean;

  @ApiProperty({
    example: 'Some note',
    description: 'Some note',
    required: true,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
