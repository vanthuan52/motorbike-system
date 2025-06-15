import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { StreamingBlobTypes } from '@smithy/types';
import { Transform, Type } from 'class-transformer';

export class AwsS3Dto {
  @ApiProperty({
    required: true,
  })
  bucket: string;

  @ApiProperty({
    required: true,
    example: faker.system.filePath(),
  })
  key: string;

  @ApiProperty({
    required: false,
    example: `${faker.internet.url()}/${faker.system.filePath()}`,
  })
  cdnUrl?: string;

  @ApiProperty({
    required: false,
    example: `${faker.internet.url()}/${faker.system.filePath()}`,
  })
  completedUrl: string;

  @ApiProperty({
    required: true,
    example: faker.system.mimeType(),
  })
  mime: string;

  @ApiProperty({
    required: true,
  })
  extension: string;

  @ApiProperty({
    required: false,
  })
  duration?: number;

  @ApiProperty({
    required: false,
  })
  data?: StreamingBlobTypes & {
    transformToString?: (encode: string) => Promise<string>;
    transformToByteArray?: () => Promise<Buffer>;
    transformToWebStream?: () => Promise<ReadableStream<Buffer>>;
  };

  @ApiProperty({
    required: true,
  })
  @Type(() => String)
  @Transform(({ value }) => Number.parseInt(value))
  size: number;
}
