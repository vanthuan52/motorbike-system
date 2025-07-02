import { PartialType } from '@nestjs/swagger';
import { PartCreateRequestDto } from './part.create.request.dto';

export class PartUpdateRequestDto extends PartialType(PartCreateRequestDto) {}
