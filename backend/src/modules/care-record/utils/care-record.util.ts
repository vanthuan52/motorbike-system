import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordDto } from '../dtos/care-record.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import { CareRecord } from '@/generated/prisma-client';

@Injectable()
export class CareRecordUtil {
  mapList(careRecords: CareRecord[]): CareRecordListResponseDto[] {
    return plainToInstance(CareRecordListResponseDto, careRecords);
  }

  mapGet(careRecord: CareRecord): CareRecordDto {
    return plainToInstance(CareRecordDto, careRecord);
  }

  mapGetFull(careRecord: CareRecord): CareRecordGetFullResponseDto {
    return plainToInstance(CareRecordGetFullResponseDto, careRecord);
  }
}
