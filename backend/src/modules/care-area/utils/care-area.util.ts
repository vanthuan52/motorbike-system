import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareAreaDto } from '../dtos/care-area.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { CareAreaModel } from '../models/care-area.model';

@Injectable()
export class CareAreaUtil {
  mapList(careAreas: CareAreaModel[]): CareAreaDto[] {
    return plainToInstance(CareAreaDto, careAreas);
  }

  mapGet(careArea: CareAreaModel): CareAreaDto {
    return plainToInstance(CareAreaDto, careArea);
  }

  mapWithServiceChecklists(
    careArea: CareAreaModel,
    serviceChecklists: any[]
  ): CareAreaWithServiceChecklistResponseDto {
    return plainToInstance(CareAreaWithServiceChecklistResponseDto, {
      ...careArea,
      serviceChecklists,
    });
  }
}
