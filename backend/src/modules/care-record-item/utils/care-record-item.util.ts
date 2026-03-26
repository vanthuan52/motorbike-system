import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CareRecordItemModel } from '../models/care-record-item.model';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemDto } from '../dtos/care-record-item.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';

@Injectable()
export class CareRecordItemUtil {
  mapList(
    careRecordItems: CareRecordItemModel[]
  ): CareRecordItemListResponseDto[] {
    return plainToInstance(CareRecordItemListResponseDto, careRecordItems);
  }

  mapGet(careRecordItem: CareRecordItemModel): CareRecordItemDto {
    return plainToInstance(CareRecordItemDto, careRecordItem);
  }

  mapGetFull(
    careRecordItem: CareRecordItemModel
  ): CareRecordItemGetFullResponseDto {
    return plainToInstance(CareRecordItemGetFullResponseDto, careRecordItem);
  }
}
