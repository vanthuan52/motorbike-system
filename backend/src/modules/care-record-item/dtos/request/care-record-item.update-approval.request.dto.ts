import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CareRecordItemUpdateApprovalRequestDto {
  @ApiProperty({
    required: true,
    example: true,
    description: 'Đồng ý hoặc không đồng ý',
  })
  @IsNotEmpty()
  @IsBoolean()
  approvedByOwner: boolean;
}
