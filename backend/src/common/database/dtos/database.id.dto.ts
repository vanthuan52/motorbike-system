import { ApiProperty, PickType } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class DatabaseIdDto extends PickType(DatabaseDto, ['id'] as const) {
  @ApiProperty({
    description: 'The unique identifier of the database record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}
