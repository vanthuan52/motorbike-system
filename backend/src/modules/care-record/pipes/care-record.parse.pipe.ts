import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordService } from '../services/care-record.service';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/care-record.status-code.enum';
import { CareRecordDoc } from '../entities/care-record.entity';

@Injectable()
export class CareRecordParsePipe implements PipeTransform {
  constructor(private readonly CareRecordService: CareRecordService) {}

  async transform(value: any): Promise<CareRecordDoc> {
    const CareRecord: CareRecordDoc | null =
      await this.CareRecordService.findOneById(value);

    if (!CareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    }

    return CareRecord;
  }
}
