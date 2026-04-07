import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  EnumCareRecordItemType,
  EnumCareRecordItemSource,
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
  @IsIn(Object.values(EnumCareRecordItemSource))
  @ApiProperty({
    example: EnumCareRecordItemSource.scheduled,
    description: 'Nguồn gốc từ đâu',
    required: true,
    enum: EnumCareRecordItemSource,
  })
  source: EnumCareRecordItemSource;

  @IsNotEmpty()
  @IsIn(Object.values(EnumCareRecordItemType))
  @ApiProperty({
    example: EnumCareRecordItemType.service,
    description: 'Thể loại của item',
    required: true,
    enum: EnumCareRecordItemType,
  })
  itemType: EnumCareRecordItemType;

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
