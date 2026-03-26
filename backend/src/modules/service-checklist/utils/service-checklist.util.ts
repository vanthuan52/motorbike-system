import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';

@Injectable()
export class ServiceChecklistUtil {
  mapList(
    serviceChecklists: ServiceChecklistModel[]
  ): ServiceChecklistListResponseDto[] {
    return plainToInstance(ServiceChecklistListResponseDto, serviceChecklists);
  }

  mapGet(serviceChecklist: ServiceChecklistModel): ServiceChecklistDto {
    return plainToInstance(ServiceChecklistDto, serviceChecklist);
  }
}
