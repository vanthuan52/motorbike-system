import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../../enums/service-checklist.enum';

export class ServiceChecklistCreateRequestDto {
  @ApiProperty({
    example: 'Kiểm tra phanh',
    description: 'Tên công việc chuẩn có thể thực hiện trên mọi xe máy',
    required: true,
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({
    example: 'kiem-tra-phanh',
    description: 'Mã công việc',
    required: true,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  code: string;

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
    example: '0',
    description: 'Thứ tự sắp xếp khi hiển thị các công việc',
    required: false,
    default: '0',
  })
  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsIn(Object.values(ENUM_SERVICE_CHECKLIST_AREA))
  @ApiProperty({
    example: ENUM_SERVICE_CHECKLIST_AREA.BRAKE,
    description: 'Công việc này sẽ thực hiện trên bộ phận nào của xe',
    required: true,
    enum: ENUM_SERVICE_CHECKLIST_AREA,
  })
  area?: ENUM_SERVICE_CHECKLIST_AREA;
}
