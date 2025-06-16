import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';

export class PartTypeResponseDto {
  @ApiProperty({
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
    description: 'Part type ID',
  })
  id: string;

  @ApiProperty({ example: 'Lọc gió' })
  name: string;

  @ApiProperty({ example: 'loc-gio' })
  slug: string;

  @ApiProperty({ example: 'Phụ tùng giúp lọc không khí', required: false })
  description?: string;

  @ApiProperty({
    example: ENUM_PART_TYPE_STATUS.ACTIVE,
    enum: () => ENUM_PART_TYPE_STATUS,
  })
  status: ENUM_PART_TYPE_STATUS;

  @ApiProperty({ example: 'https://domain.com/photo.jpg', required: false })
  photo?: string;

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

  constructor(partial: Partial<PartTypeResponseDto>) {
    Object.assign(this, partial);
  }
}
