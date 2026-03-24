import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AuthTokenResponseDto } from '@/modules/auth/dtos/response/auth.token.response.dto';

export class AuthLoginResponseDto {
  @ApiProperty({
    required: false,
    type: AuthTokenResponseDto,
    description: 'Provides access and refresh tokens upon successful login',
  })
  @Type(() => AuthTokenResponseDto)
  tokens?: AuthTokenResponseDto;
}
