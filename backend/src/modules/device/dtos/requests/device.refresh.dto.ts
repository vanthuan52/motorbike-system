import { OmitType } from '@nestjs/swagger';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';

export class DeviceRefreshRequestDto extends OmitType(DeviceRequestDto, [
  'fingerprint',
] as const) {}
