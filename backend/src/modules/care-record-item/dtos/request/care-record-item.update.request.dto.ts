import { PartialType } from '@nestjs/swagger';
import { CareRecordItemCreateRequestDto } from './care-record-item.create.request.dto';

export class CareRecordItemUpdateRequestDto extends PartialType(
  CareRecordItemCreateRequestDto
) {}
