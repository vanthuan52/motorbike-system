import { ApiProperty } from '@nestjs/swagger';
import { ENUM_PART_TYPE_STATUS } from '../../enums/part-type.enum';
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
    example: ENUM_PART_TYPE_STATUS.ACTIVE,
    enum: () => ENUM_PART_TYPE_STATUS,
  })
  status: ENUM_PART_TYPE_STATUS;

  @ApiProperty({ required: false })
  photo?: string;
}
