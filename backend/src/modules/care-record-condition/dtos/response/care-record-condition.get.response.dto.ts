import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  ENUM_BODY_CONDITION,
  ENUM_EXHAUST_COVER_CONDITION,
  ENUM_OIL_LEVEL,
  ENUM_REARVIEW_MIRROR_CONDITION,
  ENUM_SEAT_CONDITION,
} from '../../enums/care-record-condition.enum';

export class CareRecordConditionGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    example: '2c6e3880-e19b-4d9c-b023-774c13c86731',
    description: 'ID của care record',
  })
  careRecord: string;

  @ApiProperty({
    required: false,
    example: 12345,
    description: 'Số km ODO',
  })
  odoKm?: number;

  @ApiProperty({
    required: true,
    example: false,
    description: 'ODO có bị lỗi không',
  })
  odoKmFaulty: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Đồng hồ xăng có bị lỗi không',
  })
  fuelLevelFaulty: boolean;

  @ApiProperty({
    required: true,
    enum: ENUM_OIL_LEVEL,
    example: ENUM_OIL_LEVEL.FULL,
    description: 'Mức dầu nhớt máy',
  })
  engineOilLevel: ENUM_OIL_LEVEL;

  @ApiProperty({
    required: true,
    enum: ENUM_REARVIEW_MIRROR_CONDITION,
    example: ENUM_REARVIEW_MIRROR_CONDITION.PRESENT,
    description: 'Tình trạng kiếng hậu',
  })
  rearviewMirrorCondition: ENUM_REARVIEW_MIRROR_CONDITION;

  @ApiProperty({
    required: true,
    enum: ENUM_SEAT_CONDITION,
    example: ENUM_SEAT_CONDITION.OK,
    description: 'Tình trạng yên xe',
  })
  seatCondition: ENUM_SEAT_CONDITION;

  @ApiProperty({
    required: true,
    enum: ENUM_BODY_CONDITION,
    example: ENUM_BODY_CONDITION.OK,
    description: 'Tình trạng dàn áo',
  })
  bodyCondition: ENUM_BODY_CONDITION;

  @ApiProperty({
    required: true,
    enum: ENUM_EXHAUST_COVER_CONDITION,
    example: ENUM_EXHAUST_COVER_CONDITION.PRESENT,
    description: 'Tình trạng ốp pô',
  })
  exhaustCoverCondition: ENUM_EXHAUST_COVER_CONDITION;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Có baga không',
  })
  hasLuggageRack: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Có thảm lót chân không',
  })
  hasFootMat: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Có cao su gác chân không',
  })
  hasFootPegRubber: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Có áo mưa không',
  })
  hasRaincoat: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Có nón bảo hiểm không',
  })
  hasHelmet: boolean;

  @ApiProperty({
    required: false,
    example: 'Ghi chú về phụ kiện và inox...',
    description: 'Ghi chú về phụ kiện và inox',
  })
  accessoriesAndInoxNotes?: string;

  @ApiProperty({
    required: false,
    example: 'Ghi chú về tình trạng hiện hành...',
    description: 'Ghi chú về tình trạng hiện hành',
  })
  currentConditionNotes?: string;

  @ApiProperty({
    required: false,
    example: 'https://example.com/video.mp4',
    description: 'URL video',
  })
  videoUrl?: string;

  @ApiProperty({
    required: false,
    example: ['https://example.com/image1.jpg'],
    description: 'Danh sách URL hình ảnh',
  })
  imageUrls?: string[];
}
