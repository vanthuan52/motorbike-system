import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordItemService } from '../services/care-record-item.service';
import { ENUM_CARE_RECORD_ITEM_STATUS_CODE_ERROR } from '../enums/care-record-item.status-code.enum';
import { CareRecordItemDoc } from '../entities/care-record-item.entity';

@Injectable()
export class CareRecordItemParsePipe implements PipeTransform {
  constructor(private readonly careRecordItemService: CareRecordItemService) {}

  async transform(value: any): Promise<CareRecordItemDoc> {
    const careRecord: CareRecordItemDoc | null =
      await this.careRecordItemService.findOneById(value);

    if (!careRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_ITEM_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-item.error.notFound',
      });
    }

    return careRecord;
  }
}
