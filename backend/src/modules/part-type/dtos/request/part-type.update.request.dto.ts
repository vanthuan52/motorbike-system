import { PartialType } from '@nestjs/swagger';
import { PartTypeCreateRequestDto } from './part-type.create.request.dto';

export class PartTypeUpdateRequestDto extends PartialType(
  PartTypeCreateRequestDto
) {}
