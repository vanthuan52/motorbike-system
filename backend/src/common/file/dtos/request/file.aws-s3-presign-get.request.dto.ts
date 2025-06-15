import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ENUM_AWS_S3_ACCESSIBILITY } from '@/modules/aws/enums/aws.enum';

export class FileAwsS3PresignGetRequestDto {
  @ApiProperty({
    example: faker.system.filePath(),
    required: true,
    maxLength: 500,
  })
  @IsNotEmpty()
  @MinLength(1)
  key: string;

  @ApiProperty({
    required: true,
    enum: ENUM_AWS_S3_ACCESSIBILITY,
    default: ENUM_AWS_S3_ACCESSIBILITY.PRIVATE,
  })
  @IsString()
  @IsEnum(ENUM_AWS_S3_ACCESSIBILITY)
  @IsNotEmpty()
  access: ENUM_AWS_S3_ACCESSIBILITY;
}
