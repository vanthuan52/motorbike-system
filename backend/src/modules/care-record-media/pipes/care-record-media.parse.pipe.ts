import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CareRecordMediaService } from '../services/care-record-media.service';
import { ENUM_CARE_RECORD_MEDIA_STATUS_CODE_ERROR } from '../enums/care-record-media.status-code.enum';
import { CareRecordMediaDoc } from '../entities/care-record-media.entity';

@Injectable()
export class CareRecordMediaParsePipe implements PipeTransform {
  constructor(
    private readonly careRecordMediaService: CareRecordMediaService,
  ) {}

  async transform(value: any): Promise<CareRecordMediaDoc> {
    const careRecordMedia: CareRecordMediaDoc | null =
      await this.careRecordMediaService.findOneById(value);

    if (!careRecordMedia) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_MEDIA_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-media.error.notFound',
      });
    }

    return careRecordMedia;
  }
}
