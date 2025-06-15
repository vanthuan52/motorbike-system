import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { AwsS3PresignRequestDto } from './aws.s3-presign.request.dto';
import { AWS_S3_MAX_PART_NUMBER } from '../../constants/aws.constant';

export class AwsS3MultipartPresignRequestDto extends AwsS3PresignRequestDto {
  @IsNotEmpty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsInt()
  @Min(1)
  @Max(AWS_S3_MAX_PART_NUMBER)
  @ApiProperty({
    required: true,
    example: 1,
    minimum: 1,
    maximum: AWS_S3_MAX_PART_NUMBER,
  })
  maxPartNumber: number;
}
