import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumFileExtensionImage } from '@/common/file/enums/file.enum';
import { AwsS3PresignRequestDto } from '@/common/aws/dtos/request/aws.s3-presign.request.dto';

export class UserVehicleUploadPhotoRequestDto extends PickType(
  AwsS3PresignRequestDto,
  ['size'],
) {
  @ApiProperty({
    type: 'string',
    enum: EnumFileExtensionImage,
    default: EnumFileExtensionImage.jpeg,
  })
  @IsString()
  @IsEnum(EnumFileExtensionImage)
  @IsNotEmpty()
  mime: EnumFileExtensionImage;
}
