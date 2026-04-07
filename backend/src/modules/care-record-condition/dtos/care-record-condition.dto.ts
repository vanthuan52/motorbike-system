import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  EnumBodyCondition,
  EnumExhaustCoverCondition,
  EnumOilLevel,
  EnumMirrorCondition,
  EnumSeatCondition,
} from '../enums/care-record-condition.enum';

export class CareRecordConditionDto extends DatabaseDto {
  @ApiProperty({
    example: '2c6e3880-e19b-4d9c-b023-774c13c86731',
    description: 'ID của care record',
  })
  @Expose()
  careRecord: string;

  @ApiPropertyOptional({
    example: 12345,
    description: 'Số km ODO',
  })
  @Expose()
  odoKm?: number;

  @ApiProperty({
    example: false,
    description: 'ODO có bị lỗi không',
  })
  @Expose()
  odoKmFaulty: boolean;

  @ApiPropertyOptional({
    example: 75,
    description: 'Mức xăng (%)',
  })
  @Expose()
  fuelLevelPercent?: number;

  @ApiProperty({
    example: false,
    description: 'Đồng hồ xăng có bị lỗi không',
  })
  @Expose()
  fuelLevelFaulty: boolean;

  @ApiProperty({
    enum: EnumOilLevel,
    example: EnumOilLevel.full,
    description: 'Mức dầu nhớt máy',
  })
  @Expose()
  engineOilLevel: EnumOilLevel;

  @ApiProperty({
    enum: EnumMirrorCondition,
    example: EnumMirrorCondition.present,
    description: 'Tình trạng kiếng hậu',
  })
  @Expose()
  rearviewMirrorCondition: EnumMirrorCondition;

  @ApiProperty({
    enum: EnumSeatCondition,
    example: EnumSeatCondition.ok,
    description: 'Tình trạng yên xe',
  })
  @Expose()
  seatCondition: EnumSeatCondition;

  @ApiProperty({
    enum: EnumBodyCondition,
    example: EnumBodyCondition.ok,
    description: 'Tình trạng dàn áo',
  })
  @Expose()
  bodyCondition: EnumBodyCondition;

  @ApiProperty({
    enum: EnumExhaustCoverCondition,
    example: EnumExhaustCoverCondition.present,
    description: 'Tình trạng ốp pô',
  })
  @Expose()
  exhaustCoverCondition: EnumExhaustCoverCondition;

  @ApiProperty({
    example: false,
    description: 'Có baga không',
  })
  @Expose()
  hasLuggageRack: boolean;

  @ApiProperty({
    example: false,
    description: 'Có thảm lót chân không',
  })
  @Expose()
  hasFootMat: boolean;

  @ApiProperty({
    example: false,
    description: 'Có cao su gác chân không',
  })
  @Expose()
  hasFootPegRubber: boolean;

  @ApiProperty({
    example: false,
    description: 'Có áo mưa không',
  })
  @Expose()
  hasRaincoat: boolean;

  @ApiProperty({
    example: false,
    description: 'Có nón bảo hiểm không',
  })
  @Expose()
  hasHelmet: boolean;

  @ApiPropertyOptional({
    example: 'Ghi chú về phụ kiện và inox...',
    description: 'Ghi chú về phụ kiện và inox',
  })
  @Expose()
  accessoriesAndInoxNotes?: string;

  @ApiPropertyOptional({
    example: 'Ghi chú về tình trạng hiện hành...',
    description: 'Ghi chú về tình trạng hiện hành',
  })
  @Expose()
  currentConditionNotes?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/video.mp4',
    description: 'URL video',
  })
  @Expose()
  videoUrl?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/image1.jpg'],
    description: 'Danh sách URL hình ảnh',
  })
  @Expose()
  imageUrls?: string[];
}
