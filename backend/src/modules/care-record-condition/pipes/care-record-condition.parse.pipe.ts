import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordConditionService } from '../services/care-record-condition.service';
import { CareRecordConditionDoc } from '../entities/care-record-condition.entity';
import { ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR } from '../enums/care-record-condition.status-code.enum';

@Injectable()
export class CareRecordConditionParsePipe implements PipeTransform {
  constructor(
    private readonly careRecordConditionService: CareRecordConditionService,
  ) {}

  async transform(value: any): Promise<CareRecordConditionDoc> {
    const careRecordCondition: CareRecordConditionDoc | null =
      await this.careRecordConditionService.findOneById(value);

    if (!careRecordCondition) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-condition.error.notFound',
      });
    }

    return careRecordCondition;
  }
}
