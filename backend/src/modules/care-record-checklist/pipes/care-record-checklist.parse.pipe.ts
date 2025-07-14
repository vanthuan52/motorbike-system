import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordChecklistService } from '../services/care-record-checklist.service';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS_CODE_ERROR } from '../enums/care-record-checklist.status-code.enum';
import { CareRecordChecklistDoc } from '../entities/care-record-checklist.entity';

@Injectable()
export class CareRecordChecklistParsePipe implements PipeTransform {
  constructor(
    private readonly careRecordChecklistService: CareRecordChecklistService,
  ) {}

  async transform(value: any): Promise<CareRecordChecklistDoc> {
    const careRecord: CareRecordChecklistDoc | null =
      await this.careRecordChecklistService.findOneById(value);

    if (!careRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-checklist.error.notFound',
      });
    }

    return careRecord;
  }
}
