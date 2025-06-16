import { ApiProperty } from '@nestjs/swagger';
import { ENUM_PART_TYPE_STATUS } from '../../enums/part-type.enum';

export class PartTypeGetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    required: true,
    example: ENUM_PART_TYPE_STATUS.ACTIVE,
    enum: () => ENUM_PART_TYPE_STATUS,
  })
  status: ENUM_PART_TYPE_STATUS;

  @ApiProperty({ required: false })
  photo?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
