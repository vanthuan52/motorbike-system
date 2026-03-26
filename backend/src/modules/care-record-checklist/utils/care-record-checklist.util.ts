import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordChecklistModel } from '../models/care-record-checklist.model';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

@Injectable()
export class CareRecordChecklistUtil {
  mapList(
    careRecordChecklists: CareRecordChecklistModel[]
  ): CareRecordChecklistListResponseDto[] {
    return plainToInstance(
      CareRecordChecklistListResponseDto,
      careRecordChecklists
    );
  }

  mapGet(
    careRecordChecklist: CareRecordChecklistModel
  ): CareRecordChecklistDto {
    return plainToInstance(CareRecordChecklistDto, careRecordChecklist);
  }

  mapGetFull(
    careRecordChecklist: CareRecordChecklistModel
  ): CareRecordChecklistGetFullResponseDto {
    return plainToInstance(
      CareRecordChecklistGetFullResponseDto,
      careRecordChecklist
    );
  }
}
