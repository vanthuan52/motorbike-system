import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for authentication token containing token information and user role
 */
export class AuthTokenResponseDto {
  @ApiProperty({
    example: 'Bearer',
    required: true,
  })
  tokenType: string;

  @ApiProperty({
    example: ['ADMIN', 'USER'],
    type: [String],
    required: true,
  })
  roles: string[];

  @ApiProperty({
    example: 3600,
    description: 'timestamp in minutes',
    required: true,
  })
  expiresIn: number;

  @ApiProperty({
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    required: true,
  })
  refreshToken: string;
}
