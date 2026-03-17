import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../enums/care-record-media.enum';
import { EnumFileExtension } from '@/common/file/enums/file.enum';

export class CareRecordMediaDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
  })
  @Expose()
  careRecord: string;

  @ApiProperty({
    description: 'Là file của bước nào',
    example: ENUM_CARE_RECORD_MEDIA_STAGE.BEFORE,
    enum: ENUM_CARE_RECORD_MEDIA_STAGE,
  })
  @Expose()
  stage: ENUM_CARE_RECORD_MEDIA_STAGE;

  @ApiProperty({
    description: 'File extension',
    example: EnumFileExtension.png,
    enum: EnumFileExtension,
  })
  @Expose()
  type: EnumFileExtension;

  @ApiPropertyOptional({
    example: faker.image.url(),
    description: 'File url',
  })
  @Expose()
  url?: string;

  @ApiPropertyOptional({
    example: 'Description',
    description: 'Description',
  })
  @Expose()
  description?: string;
}
