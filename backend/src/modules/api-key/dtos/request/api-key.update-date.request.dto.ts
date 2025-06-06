import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { DateGreaterThanEqual } from '@/common/request/validations/request.date-greater-than.validation';
import { GreaterThanEqualOtherProperty } from '@/common/request/validations/request.greater-than-other-property.validation';

export class ApiKeyUpdateDateRequestDto {
  @ApiProperty({
    description: 'Api Key start date',
    example: faker.date.recent(),
    required: false,
  })
  @Type(() => Date)
  @IsNotEmpty()
  @DateGreaterThanEqual(new Date())
  startDate: Date;

  @ApiProperty({
    description: 'Api key end date',
    example: faker.date.recent(),
    required: false,
  })
  @Type(() => Date)
  @IsNotEmpty()
  @GreaterThanEqualOtherProperty('startDate')
  endDate: Date;
}
