import { PartialType } from '@nestjs/swagger';
import { CareRecordChecklistCreateRequestDto } from './care-record-checklist.create.request.dto';

export class CareRecordChecklistUpdateRequestDto extends PartialType(
  CareRecordChecklistCreateRequestDto,
) {}
