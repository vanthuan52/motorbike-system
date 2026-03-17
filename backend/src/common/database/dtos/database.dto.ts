import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class DatabaseDto {
  @ApiHideProperty()
  @Exclude()
  _id: string;

  // @ApiProperty({
  //   description: 'The unique identifier of the record',
  //   example: faker.string.uuid(),
  //   required: true,
  // })
  // @Expose()
  // @Transform(({ obj }) => obj._id?.toString())
  // id: string;

  @ApiProperty({
    description: 'Date created at',
    example: faker.date.recent(),
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Created by',
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Date updated at',
    example: faker.date.recent(),
    required: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Updated by',
    required: false,
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Date deleted at',
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Deleted by',
    required: false,
  })
  deletedBy?: string;

  @ApiHideProperty()
  @Exclude()
  __v?: string;
}
