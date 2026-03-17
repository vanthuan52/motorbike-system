import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { CareRecordItemDoc } from '../entities/care-record-item.entity';
import { ICareRecordItemEntity } from '../interfaces/care-record-item.interface';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemDto } from '../dtos/care-record-item.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';

@Injectable()
export class CareRecordItemUtil {
  mapList(
    careRecordItems: CareRecordItemDoc[] | ICareRecordItemEntity[],
  ): CareRecordItemListResponseDto[] {
    return plainToInstance(
      CareRecordItemListResponseDto,
      careRecordItems.map((c: CareRecordItemDoc | ICareRecordItemEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    careRecordItem: CareRecordItemDoc | ICareRecordItemEntity,
  ): CareRecordItemDto {
    return plainToInstance(
      CareRecordItemDto,
      careRecordItem instanceof Document
        ? careRecordItem.toObject()
        : careRecordItem,
    );
  }

  mapGetFull(
    careRecordItem: CareRecordItemDoc | ICareRecordItemEntity,
  ): CareRecordItemGetFullResponseDto {
    return plainToInstance(
      CareRecordItemGetFullResponseDto,
      careRecordItem instanceof Document
        ? careRecordItem.toObject()
        : careRecordItem,
    );
  }
}
