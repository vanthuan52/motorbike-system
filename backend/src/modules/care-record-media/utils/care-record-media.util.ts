import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordMediaDoc } from '../entities/care-record-media.entity';
import { ICareRecordMediaEntity } from '../interfaces/care-record-media.interface';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaDto } from '../dtos/care-record-media.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';

@Injectable()
export class CareRecordMediaUtil {
  mapList(
    careRecordMedias: CareRecordMediaDoc[] | ICareRecordMediaEntity[],
  ): CareRecordMediaListResponseDto[] {
    return plainToInstance(
      CareRecordMediaListResponseDto,
      careRecordMedias.map((c: CareRecordMediaDoc | ICareRecordMediaEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    careRecordMedia: CareRecordMediaDoc | ICareRecordMediaEntity,
  ): CareRecordMediaDto {
    return plainToInstance(
      CareRecordMediaDto,
      careRecordMedia instanceof Document
        ? careRecordMedia.toObject()
        : careRecordMedia,
    );
  }

  mapGetFull(
    careRecordMedia: CareRecordMediaDoc | ICareRecordMediaEntity,
  ): CareRecordMediaGetFullResponseDto {
    return plainToInstance(
      CareRecordMediaGetFullResponseDto,
      careRecordMedia instanceof Document
        ? careRecordMedia.toObject()
        : careRecordMedia,
    );
  }
}
