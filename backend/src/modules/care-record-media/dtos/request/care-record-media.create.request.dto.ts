import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EnumCareRecordMediaStage } from '../../enums/care-record-media.enum';
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
  @IsIn(Object.values(EnumCareRecordMediaStage))
  @ApiProperty({
    example: EnumCareRecordMediaStage.before,
    description: 'Là file của bước nào',
    required: true,
    enum: EnumCareRecordMediaStage,
  })
  stage: EnumCareRecordMediaStage;

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
