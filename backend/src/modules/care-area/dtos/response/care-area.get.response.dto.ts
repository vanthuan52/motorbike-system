import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class CareAreaGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Bộ phận nồi' })
  name: string;

  @ApiProperty({ example: 'Bộ phận nồi', required: false })
  description?: string;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Thứ tự hiển thị hạng mục',
  })
  order?: string;
}
