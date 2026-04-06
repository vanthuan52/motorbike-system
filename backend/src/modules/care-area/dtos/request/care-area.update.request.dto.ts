import { PartialType } from '@nestjs/swagger';
import { CareAreaCreateRequestDto } from './care-area.create.request.dto';

export class CareAreaUpdateRequestDto extends PartialType(
  CareAreaCreateRequestDto
) {}
