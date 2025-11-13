import { PartialType } from '@nestjs/swagger';
import { CareRecordServiceCreateRequestDto } from './care-record-service.create.request.dto';

export class CareRecordServiceUpdateRequestDto extends PartialType(
  CareRecordServiceCreateRequestDto,
) {}
