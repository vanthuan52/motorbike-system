import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareAreaDoc } from '../entities/care-area.entity';
import { ICareAreaEntity } from '../interfaces/care-area.interface';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaDto } from '../dtos/care-area.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';

@Injectable()
export class CareAreaUtil {
  mapList(
    careAreas: CareAreaDoc[] | ICareAreaEntity[],
  ): CareAreaListResponseDto[] {
    return plainToInstance(
      CareAreaListResponseDto,
      careAreas.map((c: CareAreaDoc | ICareAreaEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(careArea: CareAreaDoc | ICareAreaEntity): CareAreaDto {
    return plainToInstance(
      CareAreaDto,
      careArea instanceof Document ? careArea.toObject() : careArea,
    );
  }

  mapWithServiceChecklists(
    careArea: CareAreaDoc | ICareAreaEntity,
    serviceChecklists: any[],
  ): CareAreaWithServiceChecklistResponseDto {
    const careAreaData =
      careArea instanceof Document ? careArea.toObject() : careArea;

    return plainToInstance(CareAreaWithServiceChecklistResponseDto, {
      ...careAreaData,
      serviceChecklists,
    });
  }
}
