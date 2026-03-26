import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordMediaModel } from '../models/care-record-media.model';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaDto } from '../dtos/care-record-media.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';

@Injectable()
export class CareRecordMediaUtil {
  mapList(
    careRecordMedias: CareRecordMediaModel[]
  ): CareRecordMediaListResponseDto[] {
    return plainToInstance(CareRecordMediaListResponseDto, careRecordMedias);
  }

  mapGet(careRecordMedia: CareRecordMediaModel): CareRecordMediaDto {
    return plainToInstance(CareRecordMediaDto, careRecordMedia);
  }

  mapGetFull(
    careRecordMedia: CareRecordMediaModel
  ): CareRecordMediaGetFullResponseDto {
    return plainToInstance(CareRecordMediaGetFullResponseDto, careRecordMedia);
  }
}
