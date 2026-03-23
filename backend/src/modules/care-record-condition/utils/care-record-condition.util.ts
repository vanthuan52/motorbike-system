import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordCondition } from '@prisma/client';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';

@Injectable()
export class CareRecordConditionUtil {
  mapList(
    careRecordConditions: CareRecordCondition[]
  ): CareRecordConditionDto[] {
    return plainToInstance(CareRecordConditionDto, careRecordConditions);
  }

  mapGet(careRecordCondition: CareRecordCondition): CareRecordConditionDto {
    return plainToInstance(CareRecordConditionDto, careRecordCondition);
  }
}
