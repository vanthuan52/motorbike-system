import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { ServiceChecklistDoc } from '../entities/service-checklist.entity';
import { IServiceChecklistEntity } from '../interfaces/service-checklist.interface';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';

@Injectable()
export class ServiceChecklistUtil {
  mapList(
    serviceChecklists: ServiceChecklistDoc[] | IServiceChecklistEntity[],
  ): ServiceChecklistListResponseDto[] {
    return plainToInstance(
      ServiceChecklistListResponseDto,
      serviceChecklists.map(
        (c: ServiceChecklistDoc | IServiceChecklistEntity) =>
          c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    serviceChecklist: ServiceChecklistDoc | IServiceChecklistEntity,
  ): ServiceChecklistDto {
    return plainToInstance(
      ServiceChecklistDto,
      serviceChecklist instanceof Document
        ? serviceChecklist.toObject()
        : serviceChecklist,
    );
  }
}
