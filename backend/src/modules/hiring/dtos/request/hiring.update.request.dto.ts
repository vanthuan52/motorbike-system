import { PartialType } from '@nestjs/swagger';
import { HiringCreateRequestDto } from './hiring.create.request.dto';
export class HiringUpdateRequestDto extends PartialType(
  HiringCreateRequestDto,
) {}
