import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for confirming photo upload after client uploads via presigned URL
 * @description Client sends the S3 key after successfully uploading the file
 */
export class UserConfirmPhotoProfileRequestDto {
  @ApiProperty({
    required: true,
    description: 'S3 object key returned from presign endpoint',
    example: 'users/abc123/photo/random-filename.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  key: string;
}
