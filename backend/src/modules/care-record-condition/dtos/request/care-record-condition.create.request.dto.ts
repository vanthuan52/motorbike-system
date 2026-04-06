import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ENUM_BODY_CONDITION,
  ENUM_EXHAUST_COVER_CONDITION,
  ENUM_OIL_LEVEL,
  ENUM_REARVIEW_MIRROR_CONDITION,
  ENUM_SEAT_CONDITION,
} from '../../enums/care-record-condition.enum';

export class CareRecordConditionCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID của care record',
    required: false,
  })
  @IsString()
  @IsUUID()
  careRecord: string;

  @ApiProperty({
    example: 12345,
    description: 'Số km ODO',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  odoKm?: number;

  @ApiProperty({
    example: false,
    description: 'ODO có bị lỗi không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  odoKmFaulty?: boolean;

  @ApiProperty({
    example: 75,
    description: 'Mức nhiên liệu (%)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevelPercent?: number;

  @ApiProperty({
    example: false,
    description: 'Đồng hồ xăng có bị lỗi không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  fuelLevelFaulty?: boolean;

  @ApiProperty({
    example: ENUM_OIL_LEVEL.FULL,
    description: 'Mức dầu nhớt máy',
    enum: ENUM_OIL_LEVEL,
    required: false,
  })
  @IsOptional()
  @IsEnum(ENUM_OIL_LEVEL)
  engineOilLevel?: ENUM_OIL_LEVEL;

  @ApiProperty({
    example: ENUM_REARVIEW_MIRROR_CONDITION.PRESENT,
    description: 'Tình trạng kiếng hậu',
    enum: ENUM_REARVIEW_MIRROR_CONDITION,
    required: false,
  })
  @IsOptional()
  @IsEnum(ENUM_REARVIEW_MIRROR_CONDITION)
  rearviewMirrorCondition?: ENUM_REARVIEW_MIRROR_CONDITION;

  @ApiProperty({
    example: ENUM_SEAT_CONDITION.OK,
    description: 'Tình trạng yên xe',
    enum: ENUM_SEAT_CONDITION,
    required: false,
  })
  @IsOptional()
  @IsEnum(ENUM_SEAT_CONDITION)
  seatCondition?: ENUM_SEAT_CONDITION;

  @ApiProperty({
    example: ENUM_BODY_CONDITION.OK,
    description: 'Tình trạng dàn áo',
    enum: ENUM_BODY_CONDITION,
    required: false,
  })
  @IsOptional()
  @IsEnum(ENUM_BODY_CONDITION)
  bodyCondition?: ENUM_BODY_CONDITION;

  @ApiProperty({
    example: ENUM_EXHAUST_COVER_CONDITION.PRESENT,
    description: 'Tình trạng ốp pô',
    enum: ENUM_EXHAUST_COVER_CONDITION,
    required: false,
  })
  @IsOptional()
  @IsEnum(ENUM_EXHAUST_COVER_CONDITION)
  exhaustCoverCondition?: ENUM_EXHAUST_COVER_CONDITION;

  @ApiProperty({
    example: false,
    description: 'Có baga không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasLuggageRack?: boolean;

  @ApiProperty({
    example: false,
    description: 'Có thảm lót chân không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFootMat?: boolean;

  @ApiProperty({
    example: false,
    description: 'Có cao su gác chân không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFootPegRubber?: boolean;

  @ApiProperty({
    example: false,
    description: 'Có áo mưa không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasRaincoat?: boolean;

  @ApiProperty({
    example: false,
    description: 'Có nón bảo hiểm không',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasHelmet?: boolean;

  @ApiProperty({
    example: 'Ghi chú về phụ kiện và inox...',
    description: 'Ghi chú về phụ kiện và inox',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  accessoriesAndInoxNotes?: string;

  @ApiProperty({
    example: 'Ghi chú về tình trạng hiện hành...',
    description: 'Ghi chú về tình trạng hiện hành',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  currentConditionNotes?: string;

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    description: 'URL video',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  videoUrl?: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'Danh sách URL hình ảnh',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
