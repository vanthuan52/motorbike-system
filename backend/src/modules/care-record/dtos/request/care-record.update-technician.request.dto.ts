import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CareRecordUpdateTechnicianRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID kỹ thuật viên phụ trách',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  technician: string;
}
