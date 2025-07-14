import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../../enums/care-record-media.enum';
import { ENUM_FILE_MIME } from '@/common/file/enums/file.enum';

export class CareRecordMediaGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  careRecord: string;

  @ApiProperty({
    required: true,
    description: 'Là file của bước nào',
    example: ENUM_CARE_RECORD_MEDIA_STAGE.BEFORE,
    enum: () => ENUM_CARE_RECORD_MEDIA_STAGE,
  })
  stage: ENUM_CARE_RECORD_MEDIA_STAGE;

  @ApiProperty({
    required: true,
    description: 'File extension',
    example: ENUM_FILE_MIME.PNG,
    enum: () => ENUM_FILE_MIME,
  })
  type: ENUM_FILE_MIME;

  @ApiProperty({
    example: faker.image.url(),
    description: 'File url',
    required: false,
  })
  url?: string;

  @ApiProperty({
    example: 'Description',
    description: 'Description',
    required: false,
  })
  description?: string;
}
