import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareAreaDto } from '../dtos/care-area.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { CareArea } from '@/generated/prisma-client';

@Injectable()
export class CareAreaUtil {
  mapList(careAreas: CareArea[]): CareAreaDto[] {
    return plainToInstance(CareAreaDto, careAreas);
  }

  mapGet(careArea: CareArea): CareAreaDto {
    return plainToInstance(CareAreaDto, careArea);
  }

  mapWithServiceChecklists(
    careArea: CareArea,
    serviceChecklists: any[],
  ): CareAreaWithServiceChecklistResponseDto {
    return plainToInstance(CareAreaWithServiceChecklistResponseDto, {
      ...careArea,
      serviceChecklists,
    });
  }
}
