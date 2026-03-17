import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordDoc } from '../entities/care-record.entity';
import {
  ICareRecordDoc,
  ICareRecordEntity,
} from '../interfaces/care-record.interface';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordDto } from '../dtos/care-record.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';

@Injectable()
export class CareRecordUtil {
  mapList(
    careRecords: CareRecordDoc[] | ICareRecordEntity[],
  ): CareRecordListResponseDto[] {
    return plainToInstance(
      CareRecordListResponseDto,
      careRecords.map((c: CareRecordDoc | ICareRecordEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(careRecord: CareRecordDoc | ICareRecordEntity): CareRecordDto {
    return plainToInstance(
      CareRecordDto,
      careRecord instanceof Document ? careRecord.toObject() : careRecord,
    );
  }

  mapGetFull(
    careRecord: CareRecordDoc | ICareRecordDoc | ICareRecordEntity,
  ): CareRecordGetFullResponseDto {
    return plainToInstance(
      CareRecordGetFullResponseDto,
      careRecord instanceof Document ? careRecord.toObject() : careRecord,
    );
  }
}
