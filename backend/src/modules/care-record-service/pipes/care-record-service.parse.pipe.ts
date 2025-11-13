import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordServiceService } from '../services/care-record-service.service';
import { ENUM_CARE_RECORD_SERVICE_STATUS_CODE_ERROR } from '../enums/care-record-service.status-code.enum';
import { CareRecordServiceDoc } from '../entities/care-record-service.entity';

@Injectable()
export class CareRecordServiceParsePipe implements PipeTransform {
  constructor(
    private readonly careRecordServiceService: CareRecordServiceService,
  ) {}

  async transform(value: any): Promise<CareRecordServiceDoc> {
    const careRecord: CareRecordServiceDoc | null =
      await this.careRecordServiceService.findOneById(value);

    if (!careRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-service.error.notFound',
      });
    }

    return careRecord;
  }
}
