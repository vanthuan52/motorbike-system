import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AwsS3PresignRequestDto } from '@/common/aws/dtos/request/aws.s3-presign.request.dto';

export class UserUpdateProfilePhotoRequestDto extends PickType(
  AwsS3PresignRequestDto,
  ['size'],
) {
  @ApiProperty({
    required: true,
    description: 'photo path key',
    example: 'user/profile/unique-photo-key.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo: string;
}
