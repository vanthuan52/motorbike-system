import { ApiProperty } from '@nestjs/swagger';

export class UserCheckEmailResponseDto {
  @ApiProperty({
    required: true,
  })
  exist: boolean;
}
