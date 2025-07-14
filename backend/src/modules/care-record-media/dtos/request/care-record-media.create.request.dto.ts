import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../../enums/care-record-media.enum';
import { ENUM_FILE_MIME } from '@/common/file/enums/file.enum';

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
  @IsIn(Object.values(ENUM_FILE_MIME))
  @ApiProperty({
    example: ENUM_FILE_MIME.PNG,
    description: 'File extension',
    required: true,
    enum: ENUM_FILE_MIME,
  })
  type: ENUM_FILE_MIME;

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
