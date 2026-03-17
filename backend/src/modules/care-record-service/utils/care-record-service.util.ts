import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordServiceDoc } from '../entities/care-record-service.entity';
import { ICareRecordServiceEntity } from '../interfaces/care-record-service.interface';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceDto } from '../dtos/care-record-service.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';

@Injectable()
export class CareRecordServiceUtil {
  mapList(
    careRecordServices: CareRecordServiceDoc[] | ICareRecordServiceEntity[],
  ): CareRecordServiceListResponseDto[] {
    return plainToInstance(
      CareRecordServiceListResponseDto,
      careRecordServices.map(
        (c: CareRecordServiceDoc | ICareRecordServiceEntity) =>
          c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    careRecordService: CareRecordServiceDoc | ICareRecordServiceEntity,
  ): CareRecordServiceDto {
    return plainToInstance(
      CareRecordServiceDto,
      careRecordService instanceof Document
        ? careRecordService.toObject()
        : careRecordService,
    );
  }

  mapGetFull(
    careRecordService: CareRecordServiceDoc | ICareRecordServiceEntity,
  ): CareRecordServiceGetFullResponseDto {
    return plainToInstance(
      CareRecordServiceGetFullResponseDto,
      careRecordService instanceof Document
        ? careRecordService.toObject()
        : careRecordService,
    );
  }

  mapWithChecklists(
    serviceData: any,
    checklists: any[],
  ): CareRecordServiceWithChecklistsResponseDto {
    return plainToInstance(CareRecordServiceWithChecklistsResponseDto, {
      ...serviceData,
      checklists,
    });
  }
}
