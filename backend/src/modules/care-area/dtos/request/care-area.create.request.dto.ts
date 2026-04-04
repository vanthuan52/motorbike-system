import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CareAreaCreateRequestDto {
  @ApiProperty({
    example: 'Bộ phận nồi',
    description: 'Tên hạng mục chăm sóc',
    required: true,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({
    example: 'Some description',
    description: 'Mô tả chi tiết (có thể bỏ trống)',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 0,
    description: 'Thứ tự sắp xếp khi hiển thị các công việc',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  orderBy?: number;
}
