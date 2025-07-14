import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordService } from '../services/care-record.service';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '../enums/care-record.status-code.enum';
import { CareRecordDoc } from '../entities/care-record.entity';

@Injectable()
export class CareRecordParsePipe implements PipeTransform {
  constructor(private readonly careRecordService: CareRecordService) {}

  async transform(value: any): Promise<CareRecordDoc> {
    const careRecord: CareRecordDoc | null =
      await this.careRecordService.findOneById(value);

    if (!careRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    }

    return careRecord;
  }
}
