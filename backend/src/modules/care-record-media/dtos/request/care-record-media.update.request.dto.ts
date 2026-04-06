import { PartialType } from '@nestjs/swagger';
import { CareRecordMediaCreateRequestDto } from './care-record-media.create.request.dto';

export class CareRecordMediaUpdateRequestDto extends PartialType(
  CareRecordMediaCreateRequestDto
) {}
