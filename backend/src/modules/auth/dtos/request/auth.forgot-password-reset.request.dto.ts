import { faker } from '@faker-js/faker';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthChangePasswordRequestDto } from '@/modules/auth/dtos/request/auth.change-password.request.dto';

export class AuthForgotPasswordResetRequestDto extends IntersectionType(
  PickType(AuthChangePasswordRequestDto, ['newPassword'] as const)
) {
  @ApiProperty({
    required: true,
    description: 'Forgot password token',
    example: faker.string.alphanumeric(20),
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
