import { PartialType } from '@nestjs/swagger';
import { CareRecordCreateRequestDto } from './care-record.create.request.dto';

export class CareRecordUpdateRequestDto extends PartialType(
  CareRecordCreateRequestDto,
) {}
