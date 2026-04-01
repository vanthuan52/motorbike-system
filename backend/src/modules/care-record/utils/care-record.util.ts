import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordDto } from '../dtos/care-record.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import { CareRecordModel } from '../models/care-record.model';

@Injectable()
export class CareRecordUtil {
  mapList(careRecords: CareRecordModel[]): CareRecordListResponseDto[] {
    return plainToInstance(CareRecordListResponseDto, careRecords);
  }

  mapGet(careRecord: CareRecordModel): CareRecordDto {
    return plainToInstance(CareRecordDto, careRecord);
  }

  mapGetFull(careRecord: CareRecordModel): CareRecordGetFullResponseDto {
    return plainToInstance(CareRecordGetFullResponseDto, careRecord);
  }

  mapActivityLogMetadata(careRecord: CareRecordModel): Record<string, any> {
    return {
      careRecordId: careRecord.id,
      status: careRecord.status,
      paymentStatus: careRecord.paymentStatus,
    };
  }
}
