import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordChecklist } from '@prisma/client';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

@Injectable()
export class CareRecordChecklistUtil {
  mapList(
    careRecordChecklists: CareRecordChecklist[]
  ): CareRecordChecklistListResponseDto[] {
    return plainToInstance(
      CareRecordChecklistListResponseDto,
      careRecordChecklists
    );
  }

  mapGet(careRecordChecklist: CareRecordChecklist): CareRecordChecklistDto {
    return plainToInstance(CareRecordChecklistDto, careRecordChecklist);
  }

  mapGetFull(
    careRecordChecklist: CareRecordChecklist
  ): CareRecordChecklistGetFullResponseDto {
    return plainToInstance(
      CareRecordChecklistGetFullResponseDto,
      careRecordChecklist
    );
  }
}
