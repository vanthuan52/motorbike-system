import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordConditionModel } from '../models/care-record-condition.model';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';

@Injectable()
export class CareRecordConditionUtil {
  mapList(
    careRecordConditions: CareRecordConditionModel[]
  ): CareRecordConditionDto[] {
    return plainToInstance(CareRecordConditionDto, careRecordConditions);
  }

  mapGet(
    careRecordCondition: CareRecordConditionModel
  ): CareRecordConditionDto {
    return plainToInstance(CareRecordConditionDto, careRecordCondition);
  }
}
