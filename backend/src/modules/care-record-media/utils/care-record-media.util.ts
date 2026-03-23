import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordMedia } from '@prisma/client';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaDto } from '../dtos/care-record-media.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';

@Injectable()
export class CareRecordMediaUtil {
  mapList(
    careRecordMedias: CareRecordMedia[]
  ): CareRecordMediaListResponseDto[] {
    return plainToInstance(CareRecordMediaListResponseDto, careRecordMedias);
  }

  mapGet(careRecordMedia: CareRecordMedia): CareRecordMediaDto {
    return plainToInstance(CareRecordMediaDto, careRecordMedia);
  }

  mapGetFull(
    careRecordMedia: CareRecordMedia
  ): CareRecordMediaGetFullResponseDto {
    return plainToInstance(CareRecordMediaGetFullResponseDto, careRecordMedia);
  }
}
