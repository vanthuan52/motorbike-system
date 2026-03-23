import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServiceChecklist } from '@/generated/prisma-client';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';

@Injectable()
export class ServiceChecklistUtil {
  mapList(
    serviceChecklists: ServiceChecklist[]
  ): ServiceChecklistListResponseDto[] {
    return plainToInstance(ServiceChecklistListResponseDto, serviceChecklists);
  }

  mapGet(serviceChecklist: ServiceChecklist): ServiceChecklistDto {
    return plainToInstance(ServiceChecklistDto, serviceChecklist);
  }
}
