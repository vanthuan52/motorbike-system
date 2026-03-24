import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserListResponseDto } from '@/modules/user/dtos/response/user.list.response.dto';

export class UserExportResponseDto extends OmitType(UserListResponseDto, [
  'role',
  'photo',
]) {
  @ApiProperty({
    required: true,
    description: 'User photo URL',
    example: 'https://example.com/photo.jpg',
  })
  @Expose()
  @Transform(({ obj }) => obj.photo.completedUrl)
  photo: string;

  @ApiProperty({
    required: true,
    description: 'User role',
    example: 'admin',
  })
  @Expose()
  @Transform(({ obj }) => obj.role.name)
  role: string;
}
