import { PartialType } from '@nestjs/swagger';
import { CareRecordConditionCreateRequestDto } from './care-record-condition.create.request.dto';

export class CareRecordConditionUpdateRequestDto extends PartialType(
  CareRecordConditionCreateRequestDto,
) {}
