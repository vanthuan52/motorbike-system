import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordChecklistDoc } from '../entities/care-record-checklist.entity';
import { ICareRecordChecklistEntity } from '../interfaces/care-record-checklist.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

@Injectable()
export class CareRecordChecklistUtil {
  mapList(
    careRecordChecklists:
      | CareRecordChecklistDoc[]
      | ICareRecordChecklistEntity[],
  ): CareRecordChecklistListResponseDto[] {
    return plainToInstance(
      CareRecordChecklistListResponseDto,
      careRecordChecklists.map(
        (c: CareRecordChecklistDoc | ICareRecordChecklistEntity) =>
          c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    careRecordChecklist: CareRecordChecklistDoc | ICareRecordChecklistEntity,
  ): CareRecordChecklistDto {
    return plainToInstance(
      CareRecordChecklistDto,
      careRecordChecklist instanceof Document
        ? careRecordChecklist.toObject()
        : careRecordChecklist,
    );
  }

  mapGetFull(
    careRecordChecklist: CareRecordChecklistDoc | ICareRecordChecklistEntity,
  ): CareRecordChecklistGetFullResponseDto {
    return plainToInstance(
      CareRecordChecklistGetFullResponseDto,
      careRecordChecklist instanceof Document
        ? careRecordChecklist.toObject()
        : careRecordChecklist,
    );
  }
}
