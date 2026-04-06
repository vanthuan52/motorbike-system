import { ApiProperty, OmitType, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordDto } from '../care-record.dto';
import { UserDto } from '@/modules/user/dtos/user.dto';
import { UserVehicleDto } from '@/modules/user-vehicle/dtos/user-vehicle.dto';

export class CareRecordGetFullResponseDto extends OmitType(CareRecordDto, [
  'technician',
  'userVehicle',
] as const) {
  @ApiProperty({
    required: false,
    type: UserDto,
    oneOf: [{ $ref: getSchemaPath(UserDto) }],
  })
  @Type(() => UserDto)
  technician: UserDto;

  @ApiProperty({
    required: true,
    type: UserVehicleDto,
    oneOf: [{ $ref: getSchemaPath(UserVehicleDto) }],
  })
  @Type(() => UserVehicleDto)
  userVehicle: UserVehicleDto;
}
