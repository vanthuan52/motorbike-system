import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordGetResponseDto } from './care-record.get.response.dto';
import { UserGetResponseDto } from '@/modules/user/dtos/response/user.get.response.dto';
import { UserVehicleGetResponseDto } from '@/modules/user-vehicle/dtos/response/user-vehicle.get.response.dto';

export class CareRecordGetFullResponseDto extends OmitType(
  CareRecordGetResponseDto,
  ['technician', 'userVehicle'] as const,
) {
  @ApiProperty({
    required: false,
    type: UserGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(UserGetResponseDto) }],
  })
  @Type(() => UserGetResponseDto)
  technician: UserGetResponseDto;

  @ApiProperty({
    required: true,
    type: UserVehicleGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(UserVehicleGetResponseDto) }],
  })
  @Type(() => UserVehicleGetResponseDto)
  userVehicle: UserVehicleGetResponseDto;
}
