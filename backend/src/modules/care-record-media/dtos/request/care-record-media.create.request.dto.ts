import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
  IsString,
} from 'class-validator';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../../enums/care-record-media.enum';
import { EnumFileExtension } from '@/common/file/enums/file.enum';

export class CareRecordMediaCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careRecord: string;

  @IsNotEmpty()
  @IsIn(Object.values(ENUM_CARE_RECORD_MEDIA_STAGE))
  @ApiProperty({
    example: ENUM_CARE_RECORD_MEDIA_STAGE.BEFORE,
    description: 'Là file của bước nào',
    required: true,
    enum: ENUM_CARE_RECORD_MEDIA_STAGE,
  })
  stage: ENUM_CARE_RECORD_MEDIA_STAGE;

  @IsNotEmpty()
  @IsIn(Object.values(EnumFileExtension))
  @ApiProperty({
    example: EnumFileExtension.png,
    description: 'File extension',
    required: true,
    enum: EnumFileExtension,
  })
  type: EnumFileExtension;

  @ApiProperty({
    example: faker.image.url(),
    description: 'File url',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    example: 'Description',
    description: 'Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
