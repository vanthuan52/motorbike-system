import { ApiProperty } from '@nestjs/swagger';
import { EnumPartTypeStatus } from '../../enums/part-type.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class PartTypeGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Bugi' })
  name: string;

  @ApiProperty({ example: 'bugi' })
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Thứ tự hiển thị danh mục phụ tùng',
  })
  order?: string;

  @ApiProperty({
    required: true,
    example: EnumPartTypeStatus.active,
    enum: () => EnumPartTypeStatus,
  })
  status: EnumPartTypeStatus;

  @ApiProperty({ required: false })
  photo?: string;
}
