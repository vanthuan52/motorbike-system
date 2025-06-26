import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ENUM_STORE_STATUS } from '../enums/store.enum';

export class StoreResponseDto {
  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'Store ID',
  })
  id: string;

  @ApiProperty({
    example: 'Cửa hàng ABC',
    description: 'Tên cửa hàng',
  })
  name: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ cửa hàng',
  })
  address: string;

  @ApiProperty({
    example: '08:00 - 18:00',
    description: 'Giờ làm việc của cửa hàng',
  })
  workHours: string;

  @ApiProperty({
    example: 'cua-hang-abc',
    description: 'Slug của cửa hàng',
  })
  slug: string;

  @ApiProperty({
    example: ENUM_STORE_STATUS.ACTIVE,
    enum: ENUM_STORE_STATUS,
    description: 'Trạng thái của cửa hàng',
  })
  status: ENUM_STORE_STATUS;

  @ApiProperty({ example: 'd8c8fca1-...', required: false })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiProperty({ example: 'd8c8fca1-...', required: false })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated at',
  })
  updatedAt: Date;

  constructor(partial: Partial<StoreResponseDto>) {
    Object.assign(this, partial);
  }
}
