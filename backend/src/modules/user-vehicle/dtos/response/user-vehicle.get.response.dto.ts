import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';

export class UserVehicleGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    description: 'Biển số xe',
    example: '69FA-88888',
    maxLength: 20,
  })
  lisencePlate: string;

  @ApiProperty({
    example: 'Đỏ đen',
    description: 'Mùa xe',
    required: false,
    maxLength: 200,
  })
  color: string;

  @ApiProperty({
    example: 'SNIFHEUI47821748',
    description: 'Số máy',
    maxLength: 30,
    minLength: 1,
  })
  engineNumber: string;

  @ApiProperty({
    example: 'KKIFHEUI47821748',
    description: 'Số khung',
    maxLength: 30,
    minLength: 1,
  })
  chassisNumber: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  vehicleModel: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  user: string;

  @ApiProperty({
    required: false,
    type: AwsS3ResponseDto,
    oneOf: [{ $ref: getSchemaPath(AwsS3ResponseDto) }],
  })
  @Type(() => AwsS3ResponseDto)
  photo?: AwsS3ResponseDto;
}
