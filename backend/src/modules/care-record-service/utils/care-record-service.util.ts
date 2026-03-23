import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordService } from '@prisma/client';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceDto } from '../dtos/care-record-service.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';

@Injectable()
export class CareRecordServiceUtil {
  mapList(
    careRecordServices: CareRecordService[]
  ): CareRecordServiceListResponseDto[] {
    return plainToInstance(
      CareRecordServiceListResponseDto,
      careRecordServices
    );
  }

  mapGet(careRecordService: CareRecordService): CareRecordServiceDto {
    return plainToInstance(CareRecordServiceDto, careRecordService);
  }

  mapGetFull(
    careRecordService: CareRecordService
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
