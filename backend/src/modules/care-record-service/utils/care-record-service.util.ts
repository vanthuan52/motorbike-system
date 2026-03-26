import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordServiceModel } from '../models/care-record-service.model';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceDto } from '../dtos/care-record-service.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';

@Injectable()
export class CareRecordServiceUtil {
  mapList(
    careRecordServices: CareRecordServiceModel[]
  ): CareRecordServiceListResponseDto[] {
    return plainToInstance(
      CareRecordServiceListResponseDto,
      careRecordServices
    );
  }

  mapGet(careRecordService: CareRecordServiceModel): CareRecordServiceDto {
    return plainToInstance(CareRecordServiceDto, careRecordService);
  }

  mapGetFull(
    careRecordService: CareRecordServiceModel
  ): CareRecordServiceGetFullResponseDto {
    return plainToInstance(
      CareRecordServiceGetFullResponseDto,
      careRecordService
    );
  }

  mapWithChecklists(
    serviceData: any,
    checklists: any[]
  ): CareRecordServiceWithChecklistsResponseDto {
    return plainToInstance(CareRecordServiceWithChecklistsResponseDto, {
      ...serviceData,
      checklists,
    });
  }
}
