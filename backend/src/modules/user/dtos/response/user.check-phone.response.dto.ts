import { ApiProperty } from '@nestjs/swagger';

export class UserCheckPhoneResponseDto {
  @ApiProperty({
    required: true,
  })
  exist: boolean;
}
