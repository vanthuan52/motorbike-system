import { PartialType } from '@nestjs/swagger';
import { ServiceChecklistCreateRequestDto } from './service-checklist.create.request.dto';

export class ServiceChecklistUpdateRequestDto extends PartialType(
  ServiceChecklistCreateRequestDto
) {}
