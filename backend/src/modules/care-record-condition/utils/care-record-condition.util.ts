import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordConditionDoc } from '../entities/care-record-condition.entity';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';

@Injectable()
export class CareRecordConditionUtil {
  mapList(
    careRecordConditions: CareRecordConditionDoc[],
  ): CareRecordConditionDto[] {
    return plainToInstance(
      CareRecordConditionDto,
      careRecordConditions.map((c: CareRecordConditionDoc) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(careRecordCondition: CareRecordConditionDoc): CareRecordConditionDto {
    return plainToInstance(
      CareRecordConditionDto,
      careRecordCondition instanceof Document
        ? careRecordCondition.toObject()
        : careRecordCondition,
    );
  }
}
